const knex = require('../infra/database/knex');
const CaptureRepository = require('../repositories/CaptureRepository');
const EventRepository = require('../repositories/EventRepository');
const { raiseEvent, DomainEvent } = require('./DomainEvent');

class Capture {
  constructor(session) {
    this._session = session;
    this._captureRepository = new CaptureRepository(session);
  }

  static Capture({
    id,
    tree_id = undefined,
    image_url,
    lat,
    lon,
    created_at,
    status,
    captured_at,
    planting_organization_id,
    tag_array,
    grower_account_id,
  }) {
    return Object.freeze({
      id,
      image_url,
      planting_organization_id,
      created_at,
      latitude: lat,
      longitude: lon,
      ...(tree_id !== undefined && { tree_associated: !!tree_id }),
      tree_id,
      status,
      tags: tag_array || undefined,
      captured_at,
      grower_account_id,
    });
  }

  static CaptureCreated({
    id,
    lat,
    lon,
    grower_account_id,
    attributes,
    captured_at,
  }) {
    return Object.freeze({
      id,
      type: 'CaptureCreated',
      lat,
      lon,
      grower_account_id,
      attributes,
      captured_at,
    });
  }

  static FilterCriteria({
    tree_id = undefined,
    tree_associated = undefined,
    captured_at_start_date = undefined,
    captured_at_end_date = undefined,
    grower_account_id = undefined,
    species_id = undefined,
    organization_ids = [],
    order_by = undefined,
    order = 'desc', //
  }) {
    const parameters = Object.entries({
      tree_id,
      captured_at_start_date,
      captured_at_end_date,
      grower_account_id,
      species_id,
    })
      .filter((entry) => entry[1] !== undefined)
      .reduce((result, item) => {
        const resultCopy = { ...result };
        const [key, value] = item;
        resultCopy[key] = value;
        return resultCopy;
      }, {});

    const whereNulls = [];
    const whereNotNulls = [];
    const whereIns = [];

    if (organization_ids.length) {
      whereIns.push({
        field: 'planting_organization_id',
        values: [...organization_ids],
      });
    }

    if (tree_associated === 'true') {
      whereNotNulls.push('tree_id');
    } else if (tree_associated === 'false') {
      whereNulls.push('tree_id');
    }
    return {
      parameters,
      whereNulls,
      whereNotNulls,
      whereIns,
      sort: { order_by, order },
    };
  }

  _response(capture) {
    return this.constructor.Capture(capture);
  }

  async getCaptures(filter, options, getAll) {
    const captures = await this._captureRepository.getByFilter(
      { ...this.constructor.FilterCriteria(filter), getAll },
      options,
    );

    return captures.map((row) => this._response(row));
  }

  async getCapturesCount(filter) {
    return this._captureRepository.countByFilter({
      ...this.constructor.FilterCriteria({ ...filter, status: 'active' }),
    });
  }

  async getCaptureById(captureId) {
    const captures = await this._captureRepository.getByFilter({
      parameters: { id: captureId },
    });

    const [capture = {}] = captures;

    return this._response(capture);
  }

  async createCapture(captureObject) {
    const eventRepo = new EventRepository(this._session);

    const location = knex.raw(
      `ST_PointFromText('POINT(${captureObject.lon} ${captureObject.lat})', 4326)`,
    );
    const newCapture = {
      ...captureObject,
      estimated_geometric_location: location,
      estimated_geographic_location: location,
      attributes: captureObject.attributes
        ? { entries: captureObject.attributes }
        : null,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    const existingCapture = await this.getCaptureById(newCapture.id);
    if (existingCapture.id) {
      const domainEvent = await eventRepo.getDomainEvent(newCapture.id);
      if (domainEvent.status !== 'sent') {
        return { domainEvent, capture: existingCapture, eventRepo };
      }
      return { capture: existingCapture };
    }
    const createdCapture = await this._captureRepository.create(newCapture);
    const captureCreatedToRaise = this.constructor.CaptureCreated({
      ...createdCapture,
    });

    const raiseCaptureEvent = raiseEvent(eventRepo);
    const domainEvent = await raiseCaptureEvent(
      DomainEvent(captureCreatedToRaise),
    );

    return {
      domainEvent,
      capture: this._response(createdCapture),
      eventRepo,
    };
  }

  async updateCapture(captureObject) {
    const updatedCapture = await this._captureRepository.update({
      ...captureObject,
      updated_at: new Date().toISOString(),
    });

    return this._response(updatedCapture);
  }

  async applyVerification(verifyCaptureProcessed) {
    if (verifyCaptureProcessed.approved) {
      await this._captureRepository.update({
        id: verifyCaptureProcessed.id,
        status: 'approved',
      });
    } else {
      await this._captureRepository.update({
        id: verifyCaptureProcessed.id,
        status: 'rejected',
        rejection_reason: verifyCaptureProcessed.rejection_reason,
      });
    }
  }
}

module.exports = Capture;
