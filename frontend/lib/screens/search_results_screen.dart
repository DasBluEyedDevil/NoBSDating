import 'package:flutter/material.dart';
import '../config/app_colors.dart';
import 'paywall_screen.dart';

class SearchResultsScreen extends StatelessWidget {
  final int count;
  final Map<String, dynamic> criteria;

  const SearchResultsScreen({
    super.key,
    required this.count,
    required this.criteria,
  });

  void _showWhyWeChargeModal(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => const WhyWeChargeDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Results'),
        centerTitle: true,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Result icon
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: (isDark ? AppColors.primaryDark : AppColors.primaryLight).withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.people,
                  size: 80,
                  color: isDark ? AppColors.primaryDark : AppColors.primaryLight,
                ),
              ),
              const SizedBox(height: 32),

              // Count display
              Text(
                count.toString(),
                style: TextStyle(
                  fontSize: 72,
                  fontWeight: FontWeight.bold,
                  color: isDark ? AppColors.primaryDark : AppColors.primaryLight,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                count == 1 ? 'person matches your criteria' : 'people match your criteria',
                style: TextStyle(
                  fontSize: 18,
                  color: AppColors.textSecondary(context),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'within ${criteria['maxDistance']} miles',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textDisabled(context),
                ),
              ),
              const SizedBox(height: 48),

              // Upgrade button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () async {
                    await PaywallScreen.show(context, source: 'search_results');
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: isDark ? AppColors.primaryDark : AppColors.primaryLight,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Upgrade to Premium',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Why we charge link
              TextButton(
                onPressed: () => _showWhyWeChargeModal(context),
                child: Text(
                  'Why do we charge up-front?',
                  style: TextStyle(
                    fontSize: 14,
                    color: isDark ? AppColors.primaryDark : AppColors.primaryLight,
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Search again button
              OutlinedButton(
                onPressed: () => Navigator.of(context).pop(),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text('Search Again'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class WhyWeChargeDialog extends StatelessWidget {
  const WhyWeChargeDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Icon(
                    Icons.favorite,
                    color: isDark ? AppColors.primaryDark : AppColors.primaryLight,
                  ),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: Text(
                      'We swiped left on modern dating apps.',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Introduction
              Text(
                'We got tired of "freemium" apps that treat your love life like a slot machine, monetizing every swipe and click. So, we built the antidote.',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary(context),
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 20),

              // The Catch
              _buildSection(
                context,
                icon: Icons.attach_money,
                title: 'The Catch',
                content: 'Yes, we charge a subscription fee. Developers need to eat, and servers run on electricity, not good vibes.',
              ),
              const SizedBox(height: 16),

              // The Trade-off
              _buildSection(
                context,
                icon: Icons.lock_open,
                title: 'The Trade-off',
                content: 'Your subscription unlocks the entire app.',
              ),
              const SizedBox(height: 16),

              // One Tier
              _buildSection(
                context,
                icon: Icons.star,
                title: 'One Tier',
                content: 'No "Gold," "Platinum," or "Diamond" status. You\'re already a VIP.',
              ),
              const SizedBox(height: 16),

              // No Pay-to-Win
              _buildSection(
                context,
                icon: Icons.block,
                title: 'No Pay-to-Win',
                content: 'You can\'t pay to boost your profile. You just have to be interesting.',
              ),
              const SizedBox(height: 16),

              // Real Humans
              _buildSection(
                context,
                icon: Icons.person,
                title: 'Real Humans',
                content: 'We don\'t use AI profiles or fake notifications to stroke your ego.',
              ),
              const SizedBox(height: 16),

              // Your Face is Yours
              _buildSection(
                context,
                icon: Icons.photo_camera,
                title: 'Your Face is Yours',
                content: 'We will never use your photos for ads.',
              ),
              const SizedBox(height: 16),

              // The Unintended Bonus
              _buildSection(
                context,
                icon: Icons.security,
                title: 'The Unintended Bonus',
                content: 'Scammers and bot operators are notoriously cheap. By putting up a paywall, we keep the trash out. (We can\'t promise zero bots, but we promise to hunt down the few that pay the entry fee).',
              ),
              const SizedBox(height: 24),

              // Close button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    backgroundColor: isDark ? AppColors.primaryDark : AppColors.primaryLight,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text('Got it!'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSection(BuildContext context, {
    required IconData icon,
    required String title,
    required String content,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(
          icon,
          size: 20,
          color: isDark ? AppColors.primaryDark : AppColors.primaryLight,
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                content,
                style: TextStyle(
                  fontSize: 13,
                  color: AppColors.textSecondary(context),
                  height: 1.4,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
