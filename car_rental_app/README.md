# Car Rental Flutter App - Clean Architecture

A modern, feature-rich car rental mobile application built with Flutter using Clean Architecture principles.

## 🏗️ Architecture Overview

This project follows **Clean Architecture** principles, which provides:

- **Separation of Concerns**: Clear boundaries between different layers
- **Independence**: Business logic is independent of frameworks, UI, and data sources
- **Testability**: Easy to unit test each layer independently
- **Maintainability**: Easy to modify and extend without affecting other layers
- **Scalability**: Well-structured code that grows with your project

### Architecture Layers

```
lib/
├── core/                          # Core infrastructure
│   ├── constants/                 # App-wide constants
│   ├── errors/                    # Error handling
│   ├── network/                   # Network configuration
│   ├── themes/                    # App themes
│   ├── utils/                     # Utility functions
│   ├── widgets/                   # Reusable widgets
│   ├── di/                        # Dependency injection
│   └── routing/                   # Navigation setup
├── features/                      # Feature modules
│   ├── auth/                      # Authentication feature
│   ├── vehicles/                  # Vehicle management
│   ├── bookings/                  # Booking management
│   └── profile/                   # User profile
└── shared/                        # Shared components
```

### Feature Structure (Clean Architecture)

Each feature follows the same structure:

```
feature/
├── data/
│   ├── datasources/              # API & local data sources
│   ├── models/                   # Data models
│   └── repositories/             # Repository implementations
├── domain/
│   ├── entities/                 # Business entities
│   ├── repositories/             # Repository contracts
│   └── usecases/                 # Business logic
└── presentation/
    ├── bloc/                     # State management (BLoC)
    ├── pages/                    # UI screens
    └── widgets/                  # Feature-specific widgets
```

## 🚀 Features

### ✅ Implemented Features

1. **Authentication**
   - Login with email/password
   - User registration
   - Guest mode support
   - Form validation

2. **Vehicle Management**
   - Browse available vehicles
   - Vehicle details with specifications
   - Search and filter functionality
   - Vehicle categories and pricing

3. **Booking System**
   - Create new bookings
   - View booking history
   - Booking status tracking
   - Detailed booking information
   - Cancel/modify bookings

4. **User Profile**
   - Profile management
   - Booking statistics
   - Settings and preferences
   - Support and help

5. **Core Features**
   - Modern Material Design 3 UI
   - Dark/Light theme support
   - Responsive design
   - Navigation with bottom tabs
   - Error handling and loading states

## 🛠️ Tech Stack

### Core Framework
- **Flutter** - UI framework
- **Dart** - Programming language

### Architecture & State Management
- **Clean Architecture** - Architecture pattern
- **BLoC (flutter_bloc)** - State management
- **Get It** - Dependency injection
- **Injectable** - Code generation for DI

### Navigation & Routing
- **Go Router** - Declarative routing
- **Material Design 3** - UI design system

### Network & Data
- **Dio** - HTTP client
- **Retrofit** - Type-safe HTTP client
- **Hive** - Local database
- **Shared Preferences** - Simple local storage

### UI & UX
- **Google Fonts** - Typography
- **Cached Network Image** - Image loading
- **Intl** - Internationalization

## 🚀 Getting Started

### Prerequisites

- Flutter SDK (>=3.9.2)
- Dart SDK
- Android SDK (for Android development)
- Xcode (for iOS development)

### Installation

1. **Install dependencies**
   ```bash
   flutter pub get
   ```

2. **Generate code**
   ```bash
   flutter packages pub run build_runner build
   ```

3. **Run the app**
   ```bash
   flutter run
   ```

### Configuration

Update `lib/core/constants/app_constants.dart` for API configuration and other settings.

## 🧪 Testing

```bash
# Unit tests
flutter test

# Coverage report
flutter test --coverage
```

## 📦 Building for Production

```bash
# Android APK
flutter build apk --release

# Android App Bundle
flutter build appbundle --release

# iOS
flutter build ios --release
```

For detailed documentation, architecture guidelines, and development practices, see the full README in the project repository.
