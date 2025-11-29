import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/profile_api_service.dart';
import '../config/app_colors.dart';
import 'search_results_screen.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  // Distance options (5-100 miles in 5 mile increments)
  static const List<int> _distanceOptions = [
    5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
    55, 60, 65, 70, 75, 80, 85, 90, 95, 100
  ];

  // Gender options
  static const List<String> _genderOptions = [
    'Male',
    'Female',
    'Non-Binary',
    'Any',
  ];

  // Sexual preference options
  static const List<String> _sexualPreferenceOptions = [
    'Straight',
    'Gay',
    'Bisexual',
    'Pansexual',
    'Any',
  ];

  // Intent options
  static const List<String> _intentOptions = [
    'Chat',
    'Hookup',
    'Casual Dating',
    'New Friends',
    'Long-Term',
  ];

  // Selected values
  int _selectedDistance = 25;
  final Set<String> _selectedGenders = {'Any'};
  final Set<String> _selectedPreferences = {'Any'};
  final Set<String> _selectedIntents = {};

  bool _isSearching = false;

  void _toggleGender(String gender) {
    setState(() {
      if (gender == 'Any') {
        _selectedGenders.clear();
        _selectedGenders.add('Any');
      } else {
        _selectedGenders.remove('Any');
        if (_selectedGenders.contains(gender)) {
          _selectedGenders.remove(gender);
          if (_selectedGenders.isEmpty) {
            _selectedGenders.add('Any');
          }
        } else {
          _selectedGenders.add(gender);
        }
      }
    });
  }

  void _togglePreference(String preference) {
    setState(() {
      if (preference == 'Any') {
        _selectedPreferences.clear();
        _selectedPreferences.add('Any');
      } else {
        _selectedPreferences.remove('Any');
        if (_selectedPreferences.contains(preference)) {
          _selectedPreferences.remove(preference);
          if (_selectedPreferences.isEmpty) {
            _selectedPreferences.add('Any');
          }
        } else {
          _selectedPreferences.add(preference);
        }
      }
    });
  }

  void _toggleIntent(String intent) {
    setState(() {
      if (_selectedIntents.contains(intent)) {
        _selectedIntents.remove(intent);
      } else {
        _selectedIntents.add(intent);
      }
    });
  }

  Future<void> _performSearch() async {
    if (_selectedIntents.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select at least one intent')),
      );
      return;
    }

    setState(() {
      _isSearching = true;
    });

    try {
      final profileService = context.read<ProfileApiService>();

      // Build search criteria
      final criteria = {
        'maxDistance': _selectedDistance,
        'genders': _selectedGenders.contains('Any')
            ? ['Male', 'Female', 'Non-Binary']
            : _selectedGenders.toList(),
        'sexualPreferences': _selectedPreferences.contains('Any')
            ? ['Straight', 'Gay', 'Bisexual', 'Pansexual']
            : _selectedPreferences.toList(),
        'intents': _selectedIntents.toList(),
      };

      // Get count from API
      final count = await profileService.searchUserCount(criteria);

      if (mounted) {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => SearchResultsScreen(
              count: count,
              criteria: criteria,
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Search failed: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSearching = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Find Your Match'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Center(
              child: Column(
                children: [
                  Icon(
                    Icons.search,
                    size: 64,
                    color: isDark ? AppColors.primaryDark : AppColors.primaryLight,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'See who\'s out there',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary(context),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Set your preferences and discover how many people match',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppColors.textSecondary(context),
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Distance selector
            _buildSectionTitle('Distance From Me'),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.border(context)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<int>(
                  isExpanded: true,
                  value: _selectedDistance,
                  items: _distanceOptions.map((distance) {
                    return DropdownMenuItem<int>(
                      value: distance,
                      child: Text('$distance miles'),
                    );
                  }).toList(),
                  onChanged: (value) {
                    if (value != null) {
                      setState(() {
                        _selectedDistance = value;
                      });
                    }
                  },
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Gender selector (multi-select)
            _buildSectionTitle('Gender'),
            const SizedBox(height: 8),
            _buildChipSelector(
              options: _genderOptions,
              selectedOptions: _selectedGenders,
              onToggle: _toggleGender,
            ),
            const SizedBox(height: 24),

            // Sexual Preference selector (multi-select)
            _buildSectionTitle('Sexual Preference'),
            const SizedBox(height: 8),
            _buildChipSelector(
              options: _sexualPreferenceOptions,
              selectedOptions: _selectedPreferences,
              onToggle: _togglePreference,
            ),
            const SizedBox(height: 24),

            // Intent selector (multi-select)
            _buildSectionTitle('Intent'),
            const SizedBox(height: 8),
            _buildChipSelector(
              options: _intentOptions,
              selectedOptions: _selectedIntents,
              onToggle: _toggleIntent,
              required: true,
            ),
            const SizedBox(height: 32),

            // Search button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isSearching ? null : _performSearch,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: isDark ? AppColors.primaryDark : AppColors.primaryLight,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isSearching
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text(
                        'Search',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary(context),
      ),
    );
  }

  Widget _buildChipSelector({
    required List<String> options,
    required Set<String> selectedOptions,
    required Function(String) onToggle,
    bool required = false,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: options.map((option) {
        final isSelected = selectedOptions.contains(option);
        return FilterChip(
          label: Text(option),
          selected: isSelected,
          onSelected: (_) => onToggle(option),
          selectedColor: (isDark ? AppColors.primaryDark : AppColors.primaryLight).withValues(alpha: 0.3),
          checkmarkColor: isDark ? AppColors.primaryDark : AppColors.primaryLight,
          labelStyle: TextStyle(
            color: isSelected
                ? (isDark ? AppColors.primaryDark : AppColors.primaryLight)
                : AppColors.textPrimary(context),
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: BorderSide(
              color: isSelected
                  ? (isDark ? AppColors.primaryDark : AppColors.primaryLight)
                  : AppColors.border(context),
            ),
          ),
        );
      }).toList(),
    );
  }
}
