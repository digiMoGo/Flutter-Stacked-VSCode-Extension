[![Flutter Extensions](https://img.shields.io/badge/Flutter-grey?style=flat-square&logo=flutter&logoColor=blue)](https://flutter.dev)
[![GitHub](https://img.shields.io/github/license/digiMoGo/Flutter-Stacked-VSCode-Extension)](https://raw.githubusercontent.com/digiMoGo/Flutter-Stacked-VSCode-Extension/master/LICENSE)


# Flutter Stacked Architecture Generator

VS Code Extension to work with [Stacked Extension](https://pub.dev/packages/stacked) developed by [FilledStacks](https://www.filledstacks.com)

## Extension Settings
    
1. Initialize Architecture - ```stackedExtension.initializeArchitecture```
2. Create Views - ```stackedExtension.createViews```
3. Create Widgets - ```stackedExtension.createWidget```
4. Regenerate Routes - ```stackedExtension.regenerateRoutes```

### Initialise Architecture

- Running this command creates the boilerplate 
- Can create two kinds 
    - Responsive Views
    - Mobile Views

1. Mobile Views Directory Tree
```
.
├── README.md
├── android
├── ios
├── lib
│   ├── core
│   │   ├── base
│   │   │   ├── base_model.dart
│   │   │   └── base_service.dart
│   │   ├── locator.dart
│   │   ├── logger.dart
│   │   ├── models
│   │   ├── router.dart
│   │   ├── router.json
│   │   ├── router_constants.dart
│   │   └── services
│   ├── main.dart
│   ├── theme
│   ├── views
│   │   └── splash
│   │       ├── splash_view.dart
│   │       └── splash_view_model.dart
│   └── widgets
│       ├── dumb_widgets
│       └── smart_widgets
├── myapp.iml
├── pubspec.lock
├── pubspec.yaml
├── stackedConfig.json
├── test
│   └── widget_test.dart
└── web
```

![Mobile](images/InitializeArchitectureMobile.gif)

2. Responsive Views Directory Tree
```
.
├── README.md
├── android
├── ios
├── lib
│   ├── core
│   │   ├── base
│   │   │   ├── base_model.dart
│   │   │   └── base_service.dart
│   │   ├── locator.dart
│   │   ├── logger.dart
│   │   ├── models
│   │   ├── router.dart
│   │   ├── router.json
│   │   ├── router_constants.dart
│   │   └── services
│   ├── main.dart
│   ├── theme
│   ├── views
│   │   └── splash
│   │       ├── splash_desktop.dart
│   │       ├── splash_mobile.dart
│   │       ├── splash_tablet.dart
│   │       ├── splash_view.dart
│   │       └── splash_view_model.dart
│   └── widgets
│       ├── dumb_widgets
│       └── smart_widgets
├── myapp.iml
├── pubspec.lock
├── pubspec.yaml
├── stackedConfig.json
├── test
│   └── widget_test.dart
└── web
```

![Responsive](images/InitializeArchitectureResponsive.gif)

The command adds the following packages to the pubsec.yml file

```yaml
get_it: ^4.0.4
logger: ^0.9.2
stacked: ^1.7.6
stacked_services: ^0.5.4+2
responsive_builder: ^0.2.0+2
equatable: ^1.2.4
```

### Create Views

- Running this command creates the views based on the architecture selected in Initialise Architecture Command (i.e. Responsive or Mobile views)
- The views are created in the views folder based on the path provided
- The path may include subfolders and this folders will be created if they do not exist
- The view will be added in router

![Views](images/CreateViews.gif)

### Create Widgets 

- Running this command will generate widgets in ```lib/widgets``` folder
- Widgets can be of two types
    - Dumb Widgets: Widgets without a view model
    - Smart Widgets: Widgets with a view model
![Widgets](images/CreateWidgets.gif)

### Upcoming Features
1. Generate Services
2. Generate Models

### Contributors 

1. [Ajil Oomen](https://github.com/ajilo297)
2. [Madhukesh D](https://github.com/madhukesh048)
3. [Jugal D Wadhwa](https://github.com/jugalw13)