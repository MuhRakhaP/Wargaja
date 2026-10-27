import 'package:wargaja/models/resident.dart';
import 'package:wargaja/repositories/resident.dart' as residentRepo;

/// KK repository provides KK-specific views over residents.
class KkRepository {
  /// Return residents that have KK images (kkUrl non-empty) — used as Data KK source.
  static List<Warga> getKkItems({int count = 60}) {
    // Use resident repo generator so data is consistent across app
    final all = residentRepo.WargaRepository.generateDummy(count: count);
    return all.where((w) => w.kkUrl.isNotEmpty).toList();
  }
}
