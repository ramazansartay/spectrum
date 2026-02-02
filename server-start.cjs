process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err && (err.stack || err.message || err));
  setTimeout(() => process.exit(1), 100);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason && (reason.stack || reason.message || reason));
  setTimeout(() => process.exit(1), 100);
});
const path = require('path');
const entry = path.join(__dirname, 'dist', 'index.cjs');
console.log('Wrapper: requiring', entry);
try {
  require(entry);
} catch (err) {
  console.error('STARTUP ERROR (sync require):', err && (err.stack || err.message || err));
  process.exit(1);
}