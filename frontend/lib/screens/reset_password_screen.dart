import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../constants/spacing.dart';
import '../constants/text_styles.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String token;

  const ResetPasswordScreen({
    super.key,
    required this.token,
  });

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _isLoading = false;
  bool _resetSuccessful = false;
  String? _errorMessage;

  @override
  void dispose() {
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  bool _validatePassword(String password) {
    // Must be at least 8 characters
    if (password.length < 8) return false;

    // Must contain at least one letter
    if (!password.contains(RegExp(r'[a-zA-Z]'))) return false;

    // Must contain at least one number
    if (!password.contains(RegExp(r'[0-9]'))) return false;

    return true;
  }

  String _getPasswordRequirements(String password) {
    final requirements = <String>[];

    if (password.length < 8) {
      requirements.add('At least 8 characters');
    }
    if (!password.contains(RegExp(r'[a-zA-Z]'))) {
      requirements.add('At least one letter');
    }
    if (!password.contains(RegExp(r'[0-9]'))) {
      requirements.add('At least one number');
    }

    if (requirements.isEmpty) {
      return 'Password meets all requirements';
    }

    return 'Required: ${requirements.join(', ')}';
  }

  Future<void> _resetPassword() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final authService = context.read<AuthService>();
      final result = await authService.resetPassword(
        widget.token,
        _passwordController.text,
      );

      if (mounted) {
        if (result['success'] == true) {
          setState(() {
            _resetSuccessful = true;
            _isLoading = false;
          });
        } else {
          setState(() {
            _errorMessage = result['message'] ?? 'Failed to reset password';
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'An error occurred. Please try again.';
          _isLoading = false;
        });
      }
    }
  }

  void _backToLogin() {
    // Pop back to the login screen
    Navigator.of(context).popUntil((route) => route.isFirst);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        behavior: HitTestBehavior.translucent,
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Theme.of(context).brightness == Brightness.dark
                    ? AppColors.primaryDark
                    : AppColors.primaryLight,
                Theme.of(context).brightness == Brightness.dark
                    ? AppColors.primaryDark.withValues(alpha: 0.7)
                    : AppColors.primaryLight.withValues(alpha: 0.7),
              ],
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: Spacing.paddingLg,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Spacer(),
                  // Title
                  Text(
                    _resetSuccessful ? 'Password Reset!' : 'Reset Password',
                    textAlign: TextAlign.center,
                    style: AppTextStyles.displaySmall.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Spacing.verticalMd,
                  Text(
                    _resetSuccessful
                        ? 'Your password has been successfully reset. You can now sign in with your new password.'
                        : 'Enter your new password below',
                    textAlign: TextAlign.center,
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: Colors.white.withValues(alpha: 0.9),
                    ),
                  ),
                  Spacing.verticalXl,
                  // Success state
                  if (_resetSuccessful)
                    Column(
                      children: [
                        Container(
                          padding: Spacing.paddingXl,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
                            borderRadius: Spacing.borderRadiusLg,
                          ),
                          child: Icon(
                            Icons.check_circle,
                            color: Colors.white,
                            size: 64,
                          ),
                        ),
                        Spacing.verticalXl,
                        ElevatedButton(
                          onPressed: _backToLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: Spacing.borderRadiusMd,
                            ),
                            elevation: 4,
                            textStyle: AppTextStyles.button,
                          ),
                          child: const Text('Back to Login'),
                        ),
                      ],
                    )
                  // Loading state
                  else if (_isLoading)
                    Center(
                      child: Container(
                        padding: Spacing.paddingXl,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: Spacing.borderRadiusLg,
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                            Spacing.verticalMd,
                            Text(
                              'Resetting your password...',
                              style: AppTextStyles.bodyMedium.copyWith(
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  // Form state
                  else
                    Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Error message
                          if (_errorMessage != null) ...[
                            Container(
                              padding: Spacing.paddingMd,
                              decoration: BoxDecoration(
                                color: Colors.red.withValues(alpha: 0.2),
                                borderRadius: Spacing.borderRadiusMd,
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.error_outline,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      _errorMessage!,
                                      style: AppTextStyles.bodySmall.copyWith(
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Spacing.verticalMd,
                          ],
                          // Password input
                          TextFormField(
                            controller: _passwordController,
                            obscureText: _obscurePassword,
                            autocorrect: false,
                            onChanged: (value) {
                              // Trigger rebuild to update password requirements display
                              setState(() {});
                            },
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors.white,
                              hintText: 'New Password',
                              prefixIcon: const Icon(Icons.lock_outlined),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                ),
                                onPressed: () {
                                  setState(() {
                                    _obscurePassword = !_obscurePassword;
                                  });
                                },
                              ),
                              border: OutlineInputBorder(
                                borderRadius: Spacing.borderRadiusMd,
                                borderSide: BorderSide.none,
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: Spacing.borderRadiusMd,
                                borderSide: BorderSide.none,
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: Spacing.borderRadiusMd,
                                borderSide: const BorderSide(color: AppColors.primary, width: 2),
                              ),
                              errorBorder: OutlineInputBorder(
                                borderRadius: Spacing.borderRadiusMd,
                                borderSide: const BorderSide(color: Colors.red, width: 2),
                              ),
                              focusedErrorBorder: OutlineInputBorder(
                                borderRadius: Spacing.borderRadiusMd,
                                borderSide: const BorderSide(color: Colors.red, width: 2),
                              ),
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter a password';
                              }
                              if (!_validatePassword(value)) {
                                return 'Password does not meet requirements';
                              }
                              return null;
                            },
                          ),
                          // Password requirements display
                          if (_passwordController.text.isNotEmpty) ...[
                            Spacing.verticalSm,
                            Container(
                              padding: Spacing.paddingMd,
                              decoration: BoxDecoration(
                                color: _validatePassword(_passwordController.text)
                                    ? Colors.green.withValues(alpha: 0.2)
                                    : Colors.white.withValues(alpha: 0.15),
                                borderRadius: Spacing.borderRadiusMd,
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    _validatePassword(_passwordController.text)
                                        ? Icons.check_circle
                                        : Icons.info_outline,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      _getPasswordRequirements(_passwordController.text),
                                      style: AppTextStyles.caption.copyWith(
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                          Spacing.verticalMd,
                          // Confirm password input
                          TextFormField(
                            controller: _confirmPasswordController,
                            obscureText: _obscureConfirmPassword,
                            autocorrect: false,
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors.white,
                              hintText: 'Confirm Password',
                              prefixIcon: const Icon(Icons.lock_outlined),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscureConfirmPassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                ),
                                onPressed: () {
                                  setState(() {
                                    _obscureConfirmPassword = !_obscureConfirmPassword;
                                  });
                                },
                              ),
                              border: OutlineInputBorder(
                                borderRadius: Spacing.borderRadiusMd,
                                borderSide: BorderSide.none,
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: Spacing.borderRadiusMd,
                                borderSide: BorderSide.none,
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: Spacing.borderRadiusMd,
                                borderSide: const BorderSide(color: AppColors.primary, width: 2),
                              ),
                              errorBorder: OutlineInputBorder(
                                borderRadius: Spacing.borderRadiusMd,
                                borderSide: const BorderSide(color: Colors.red, width: 2),
                              ),
                              focusedErrorBorder: OutlineInputBorder(
                                borderRadius: Spacing.borderRadiusMd,
                                borderSide: const BorderSide(color: Colors.red, width: 2),
                              ),
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please confirm your password';
                              }
                              if (value != _passwordController.text) {
                                return 'Passwords do not match';
                              }
                              return null;
                            },
                          ),
                          Spacing.verticalXl,
                          // Reset password button
                          ElevatedButton(
                            onPressed: _resetPassword,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: Spacing.borderRadiusMd,
                              ),
                              elevation: 4,
                              textStyle: AppTextStyles.button,
                            ),
                            child: const Text('Reset Password'),
                          ),
                          Spacing.verticalMd,
                          // Back to login link
                          Center(
                            child: TextButton(
                              onPressed: _backToLogin,
                              child: Text(
                                'Back to Login',
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: Colors.white,
                                  decoration: TextDecoration.underline,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  const Spacer(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
