import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:wargaja/theme/app_colors.dart';

class ResidentsDirectoryScreen extends StatefulWidget {
  const ResidentsDirectoryScreen({super.key});

  @override
  State<ResidentsDirectoryScreen> createState() =>
      _ResidentsDirectoryScreenState();
}

class _ResidentsDirectoryScreenState extends State<ResidentsDirectoryScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Data Warga',
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
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
            child: TextField(
              controller: _searchController,
              onChanged: (value) => setState(() => _query = value.trim()),
              decoration: InputDecoration(
                hintText: 'Cari nama, RT, atau RW',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
              ),
            ),
          ),
          Expanded(
            child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
              stream: FirebaseFirestore.instance
                  .collection('users')
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return _Message(
                    icon: Icons.error_outline,
                    text: 'Gagal memuat data warga: ${snapshot.error}',
                  );
                }

                final residents = (snapshot.data?.docs ?? [])
                    .map((doc) => {'id': doc.id, ...doc.data()})
                    .where((resident) {
                      if (_query.isEmpty) return true;
                      final name = (resident['name'] ?? '')
                          .toString()
                          .toLowerCase();
                      final rt = (resident['rt'] ?? '').toString().toLowerCase();
                      final rw = (resident['rw'] ?? '').toString().toLowerCase();
                      final query = _query.toLowerCase();
                      return name.contains(query) ||
                          rt.contains(query) ||
                          rw.contains(query);
                    })
                    .toList()
                  ..sort(
                    (a, b) => (a['name'] ?? '')
                        .toString()
                        .toLowerCase()
                        .compareTo((b['name'] ?? '').toString().toLowerCase()),
                  );

                if (residents.isEmpty) {
                  return const _Message(
                    icon: Icons.people_outline,
                    text: 'Belum ada data warga yang cocok.',
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(20),
                  itemCount: residents.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) =>
                      _ResidentCard(resident: residents[index]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _ResidentCard extends StatelessWidget {
  const _ResidentCard({required this.resident});

  final Map<String, dynamic> resident;

  static const Map<String, String> _roleLabels = {
    'admin': 'Admin',
    'ketua_rt': 'Ketua RT',
    'ketua_rw': 'Ketua RW',
    'secretary': 'Sekretaris',
    'treasurer': 'Bendahara',
    'resident': 'Warga',
  };

  @override
  Widget build(BuildContext context) {
    final name = (resident['name'] ?? 'Warga').toString();
    final phone = (resident['phone'] ?? '').toString();
    final rt = (resident['rt'] ?? '-').toString();
    final rw = (resident['rw'] ?? '-').toString();
    final role = _roleLabels[resident['role']] ?? 'Warga';

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: AppColors.primaryLight,
            child: Text(
              name.isNotEmpty ? name[0].toUpperCase() : 'W',
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '$role • RT $rt / RW $rw',
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          if (phone.isNotEmpty)
            IconButton(
              tooltip: 'Hubungi $name',
              icon: const Icon(Icons.phone_outlined, color: AppColors.primary),
              onPressed: () => _call(context, phone),
            ),
        ],
      ),
    );
  }

  Future<void> _call(BuildContext context, String phone) async {
    final uri = Uri(scheme: 'tel', path: phone);
    final launched = await launchUrl(uri);
    if (!launched && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Tidak dapat menghubungi $phone')),
      );
    }
  }
}

class _Message extends StatelessWidget {
  const _Message({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 56, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              text,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
          ],
        ),
      ),
    );
  }
}
