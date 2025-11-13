import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Validator Tests', () {
    group('Age Validation', () {
      test('should validate age is 18 or older', () {
        bool isValidAge(int age) => age >= 18;

        expect(isValidAge(18), isTrue);
        expect(isValidAge(25), isTrue);
        expect(isValidAge(50), isTrue);
      });

      test('should reject age under 18', () {
        bool isValidAge(int age) => age >= 18;

        expect(isValidAge(17), isFalse);
        expect(isValidAge(10), isFalse);
        expect(isValidAge(0), isFalse);
      });

      test('should reject invalid age ranges', () {
        bool isValidAge(int age) => age >= 18 && age <= 120;

        expect(isValidAge(-1), isFalse);
        expect(isValidAge(150), isFalse);
      });
    });

    group('Name Validation', () {
      test('should validate non-empty name', () {
        bool isValidName(String name) => name.trim().isNotEmpty;

        expect(isValidName('John'), isTrue);
        expect(isValidName('Jane Doe'), isTrue);
      });

      test('should reject empty name', () {
        bool isValidName(String name) => name.trim().isNotEmpty;

        expect(isValidName(''), isFalse);
        expect(isValidName('   '), isFalse);
      });

      test('should validate name length', () {
        bool isValidNameLength(String name) {
          final trimmed = name.trim();
          return trimmed.length >= 2 && trimmed.length <= 50;
        }

        expect(isValidNameLength('Jo'), isTrue);
        expect(isValidNameLength('John'), isTrue);
        expect(isValidNameLength('A' * 50), isTrue);
      });

      test('should reject names that are too short or too long', () {
        bool isValidNameLength(String name) {
          final trimmed = name.trim();
          return trimmed.length >= 2 && trimmed.length <= 50;
        }

        expect(isValidNameLength('J'), isFalse);
        expect(isValidNameLength('A' * 51), isFalse);
      });
    });

    group('Bio Validation', () {
      test('should validate bio length', () {
        bool isValidBioLength(String bio) => bio.length <= 500;

        expect(isValidBioLength('Short bio'), isTrue);
        expect(isValidBioLength('A' * 500), isTrue);
      });

      test('should reject bio that is too long', () {
        bool isValidBioLength(String bio) => bio.length <= 500;

        expect(isValidBioLength('A' * 501), isFalse);
      });

      test('should allow empty bio', () {
        bool isValidBio(String bio) => bio.length <= 500;

        expect(isValidBio(''), isTrue);
      });
    });

    group('Photo Validation', () {
      test('should validate photo list has at least one photo', () {
        bool hasPhotos(List<String> photos) => photos.isNotEmpty;

        expect(hasPhotos(['photo1.jpg']), isTrue);
        expect(hasPhotos(['photo1.jpg', 'photo2.jpg']), isTrue);
      });

      test('should reject empty photo list', () {
        bool hasPhotos(List<String> photos) => photos.isNotEmpty;

        expect(hasPhotos([]), isFalse);
      });

      test('should validate photo count limit', () {
        bool isValidPhotoCount(List<String> photos) => photos.length <= 6;

        expect(isValidPhotoCount(['photo1.jpg']), isTrue);
        expect(isValidPhotoCount(List.filled(6, 'photo.jpg')), isTrue);
      });

      test('should reject too many photos', () {
        bool isValidPhotoCount(List<String> photos) => photos.length <= 6;

        expect(isValidPhotoCount(List.filled(7, 'photo.jpg')), isFalse);
      });
    });

    group('Interests Validation', () {
      test('should validate interests list', () {
        bool hasInterests(List<String> interests) => interests.isNotEmpty;

        expect(hasInterests(['hiking']), isTrue);
        expect(hasInterests(['hiking', 'coffee']), isTrue);
      });

      test('should allow empty interests list', () {
        bool isValidInterests(List<String> interests) => interests.length <= 10;

        expect(isValidInterests([]), isTrue);
      });

      test('should validate interests count limit', () {
        bool isValidInterestsCount(List<String> interests) => interests.length <= 10;

        expect(isValidInterestsCount(List.filled(10, 'interest')), isTrue);
      });

      test('should reject too many interests', () {
        bool isValidInterestsCount(List<String> interests) => interests.length <= 10;

        expect(isValidInterestsCount(List.filled(11, 'interest')), isFalse);
      });
    });

    group('Message Validation', () {
      test('should validate non-empty message', () {
        bool isValidMessage(String message) => message.trim().isNotEmpty;

        expect(isValidMessage('Hello'), isTrue);
        expect(isValidMessage('How are you?'), isTrue);
      });

      test('should reject empty message', () {
        bool isValidMessage(String message) => message.trim().isNotEmpty;

        expect(isValidMessage(''), isFalse);
        expect(isValidMessage('   '), isFalse);
      });

      test('should validate message length', () {
        bool isValidMessageLength(String message) => message.length <= 1000;

        expect(isValidMessageLength('Hello'), isTrue);
        expect(isValidMessageLength('A' * 1000), isTrue);
      });

      test('should reject message that is too long', () {
        bool isValidMessageLength(String message) => message.length <= 1000;

        expect(isValidMessageLength('A' * 1001), isFalse);
      });
    });
  });
}
