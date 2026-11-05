import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:wargaja/theme/app_colors.dart';

class EmergencyContactsScreen extends StatelessWidget {
  const EmergencyContactsScreen({super.key});

  static const List<_EmergencyContact> _contacts = [
    _EmergencyContact(
      label: 'Nomor Darurat Nasional',
      number: '112',
      description: 'Satu nomor untuk semua keadaan darurat',
      icon: Icons.emergency_rounded,
      color: AppColors.error,
    ),
    _EmergencyContact(
      label: 'Ambulans / Gawat Darurat',
      number: '119',
      description: 'Layanan ambulans dan medis darurat',
      icon: Icons.local_hospital_rounded,
      color: Color(0xFFDC2626),
    ),
    _EmergencyContact(
      label: 'Polisi',
      number: '110',
      description: 'Keamanan dan tindak kriminal',
      icon: Icons.local_police_rounded,
      color: Color(0xFF1D4ED8),
    ),
    _EmergencyContact(
      label: 'Pemadam Kebakaran',
      number: '113',
      description: 'Kebakaran dan penyelamatan',
      icon: Icons.fire_truck_rounded,
      color: Color(0xFFEA580C),
    ),
    _EmergencyContact(
      label: 'Basarnas',
      number: '115',
      description: 'Pencarian dan pertolongan',
      icon: Icons.support_rounded,
      color: Color(0xFF0F766E),
    ),
    _EmergencyContact(
      label: 'PLN',
      number: '123',
      description: 'Gangguan listrik',
      icon: Icons.bolt_rounded,
      color: Color(0xFFCA8A04),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Kontak Darurat',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: Colors.black,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => context.pop(),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Row(
              children: [
                Icon(Icons.info_outline, color: AppColors.primary),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Untuk kejadian di lingkungan sekitar, hubungi juga '
                    'pengurus RT/RW setempat.',
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.primaryPressed,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          ..._contacts.map(
            (contact) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _ContactCard(contact: contact),
            ),
          ),
        ],
      ),
    );
  }
}

class _ContactCard extends StatelessWidget {
  const _ContactCard({required this.contact});

  final _EmergencyContact contact;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () => _call(context),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: contact.color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(contact.icon, color: contact.color),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      contact.label,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      contact.description,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    contact.number,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: contact.color,
                    ),
                  ),
                  const SizedBox(height: 2),
                  const Icon(
                    Icons.phone_in_talk_rounded,
                    size: 16,
                    color: AppColors.textSecondary,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _call(BuildContext context) async {
    final uri = Uri(scheme: 'tel', path: contact.number);
    final launched = await launchUrl(uri);
    if (!launched && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Tidak dapat menelepon ${contact.number}')),
      );
    }
  }
}

class _EmergencyContact {
  const _EmergencyContact({
    required this.label,
    required this.number,
    required this.description,
    required this.icon,
    required this.color,
  });

  final String label;
  final String number;
  final String description;
  final IconData icon;
  final Color color;
}
