// Simple Hello World application
// This demonstrates Node.js in the development environment

console.log('Hello from Development Studio!');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);

// Example function
function greet(name) {
  return `Hello, ${name}! Welcome to the Development Studio.`;
}

// Test the function
console.log(greet('Developer'));

// Example async operation
setTimeout(() => {
  console.log('Async operations work too!');
}, 1000);
