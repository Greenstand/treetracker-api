const sinon = require('sinon');
const Broker = require('rascal').BrokerAsPromised;

let brokerStub;

before(async () => {
  brokerStub = sinon.stub(Broker, 'create').resolves({
    publish: () => {
      return {
        on: (state, callback) => {
          if (state === 'success') callback();
        },
      };
    },
  });
});

after(async () => {
  brokerStub.restore();
});
