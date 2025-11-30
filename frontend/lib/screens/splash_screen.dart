import 'package:flutter/material.dart';

class SplashScreen extends StatefulWidget {
  final VoidCallback onComplete;

  const SplashScreen({super.key, required this.onComplete});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _logoController;
  late AnimationController _fadeController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();

    // Logo scale and pulse animation
    _logoController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    _scaleAnimation = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(
        parent: _logoController,
        curve: Curves.elasticOut,
      ),
    );

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.08).animate(
      CurvedAnimation(
        parent: _logoController,
        curve: Curves.easeInOut,
      ),
    );

    // Fade out animation
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );

    _fadeAnimation = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _fadeController,
        curve: Curves.easeOut,
      ),
    );

    // Start the animation sequence
    _startAnimations();
  }

  Future<void> _startAnimations() async {
    // Start logo animation
    _logoController.forward();

    // Wait for logo animation + hold time
    await Future.delayed(const Duration(milliseconds: 2000));

    // Fade out
    await _fadeController.forward();

    // Complete
    widget.onComplete();
  }

  @override
  void dispose() {
    _logoController.dispose();
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF2D1B4E), // Deep purple
                Color(0xFF1A0F2E), // Darker purple
              ],
            ),
          ),
          child: Center(
            child: AnimatedBuilder(
              animation: _logoController,
              builder: (context, child) {
                return Transform.scale(
                  scale: _scaleAnimation.value * _pulseAnimation.value,
                  child: child,
                );
              },
              child: Image.asset(
                'assets/images/logo.png',
                width: 200,
                height: 200,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
