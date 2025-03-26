
// Browser environment
if (typeof window === 'object') {
  const { worker } = require('./tests/mocks/browser');
  worker.start({
    onUnhandledRequest: 'bypass', // 'bypass' | 'warn' | 'error'
  });
}
