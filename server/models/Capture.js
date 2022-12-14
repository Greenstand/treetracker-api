const knex = require('../infra/database/knex');
const CaptureRepository = require('../repositories/CaptureRepository');
const { DomainEventTypes } = require('../utils/enums');
const DomainEvent = require('./DomainEvent');

class Capture {
  constructor(session) {
    this._session = session;
    this._captureRepository = new CaptureRepository(session);
  }

  static Capture({
    id,
    reference_id,
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
    morphology,
    age,
    note,
    attributes,
    species_id,
    session_id,
    device_configuration_id,
  }) {
    return Object.freeze({
      id,
      reference_id,
      image_url,
      planting_organization_id,
      created_at,
      lat,
      lon,
      ...(tree_id !== undefined && { tree_associated: !!tree_id }),
      tree_id,
      status,
      tags: tag_array || [],
      captured_at,
      grower_account_id,
      morphology,
      age,
      note,
      attributes,
      species_id,
      session_id,
      device_configuration_id,
    });
  }

  static CaptureCreated({
    id,
    reference_id,
    lat,
    lon,
    grower_account_id,
    attributes,
    captured_at,
  }) {
    return Object.freeze({
      id,
      reference_id,
      approved: true,
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
    reference_id = undefined,
    tree_associated = undefined,
    captured_at_start_date = undefined,
    captured_at_end_date = undefined,
    grower_account_id = undefined,
    species_id = undefined,
    organization_ids = [],
    order_by = undefined,
    matchting_tree_distance = undefined,
    matchting_tree_time_range = undefined,
    order = 'desc', //
  }) {
    const parameters = Object.entries({
      tree_id,
      reference_id,
      captured_at_start_date,
      captured_at_end_date,
      grower_account_id,
      species_id,
      matchting_tree_distance,
      matchting_tree_time_range,
      organization_ids,
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
    const domainEventModel = new DomainEvent(this._session);

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

    const existingCapture = await this._captureRepository.getById(
      newCapture.id,
    );
    if (existingCapture?.id) {
      if (existingCapture.status === 'deleted') {
        // capture was approved and then rejected
        const updatedCapture = await this.updateCapture({
          id: existingCapture.id,
          status: 'active',
        });

        const captureToRaise = this.constructor.CaptureCreated({
          ...updatedCapture,
        });

        const newDomainEvent = await domainEventModel.raiseEvent(
          captureToRaise,
        );
        return {
          domainEvent: newDomainEvent,
          capture: this._response(updatedCapture),
          status: 200,
        };
      }
      // get capture populated with join details
      const captureWithFullDetails = await this.getCaptureById(newCapture.id);
      const domainEvent = await domainEventModel.getDomainEvent(
        captureWithFullDetails.id,
        DomainEventTypes.CaptureCreated,
      );
      if (!domainEvent) {
        const captureToRaise = this.constructor.CaptureCreated({
          ...captureWithFullDetails,
        });
        const newDomainEvent = await domainEventModel.raiseEvent(
          captureToRaise,
        );
        return {
          domainEvent: newDomainEvent,
          capture: this._response(captureWithFullDetails),
          status: 200,
        };
      } if (domainEvent.status !== 'sent') {
        return {
          domainEvent,
          capture: captureWithFullDetails,
          status: 200,
        };
      }
      return { capture: this._response(existingCapture), status: 200 };
    }
    const createdCapture = await this._captureRepository.create(newCapture);
    const captureCreatedToRaise = this.constructor.CaptureCreated({
      ...createdCapture,
    });

    const domainEvent = await domainEventModel.raiseEvent(
      captureCreatedToRaise,
    );

    return {
      domainEvent,
      capture: this._response(createdCapture),
      status: 201,
    };
  }

  async updateCapture(captureObject) {
    const updatedCapture = await this._captureRepository.update({
      ...captureObject,
      updated_at: new Date().toISOString(),
    });

    return this._response(updatedCapture);
  }
}

module.exports = Capture;
