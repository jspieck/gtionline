# GTI Online

A web-based platform for learning and practicing computer science algorithms, with a focus on Boolean functions, IEEE-754 floating-point operations, and polyadic number systems.

## 🚀 Features

- Interactive algorithm visualization
- Step-by-step execution of complex operations
- Support for multiple algorithm categories:
  - Boolean Functions and Logic
  - IEEE-754 Floating Point Operations
  - Polyadic Number System Conversions
  - Base-N Complement Arithmetic

## 🛠️ Technology Stack

- Vue.js - Frontend framework
- JavaScript/TypeScript - Core logic implementation
- NPM - Package management
- ESLint - Code quality and style enforcement

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- NPM (comes with Node.js)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gtionline.git
cd gtionline
```

2. Install dependencies:
```bash
npm install
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run serve
```
This will start a development server with hot-reload at `http://localhost:8080`

### Production Build
```bash
npm run build
```

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## 📦 Deployment

### Server Setup
1. Install the serve package globally (requires root permissions):
```bash
npm install -g serve
```

### Deploying the Website
1. Build the project:
```bash
npm run build
```

2. Start the server:
```bash
serve -s dist
```

## 🧪 Testing

The project includes comprehensive test suites for:
- Algorithm implementations
- UI components
- Utility functions

Run tests using:
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

For configuration options, please refer to the [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).
