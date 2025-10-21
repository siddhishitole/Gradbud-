import 'package:flutter/material.dart';

void main() {
  runApp(const CredBudApp());
}

class CredBudApp extends StatelessWidget {
  const CredBudApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CredBud Demo',
      home: Scaffold(
        appBar: AppBar(title: const Text('CredBud (Flutter demo)')),
        body: const Center(child: Text('This is a placeholder Flutter app. Integrate REST APIs for full functionality.')),
      ),
    );
  }
}
