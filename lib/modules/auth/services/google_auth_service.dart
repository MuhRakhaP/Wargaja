import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

/// Google OAuth client IDs for the `wargaja-91e14` Firebase project.
///
/// This is the **Web** OAuth client (`client_type: 3` in `google-services.json`)
/// that Firebase Auth itself uses for the Google provider. Google Sign-In on
/// Android needs it as `serverClientId` so the returned `idToken` is issued for
/// an audience Firebase Auth will accept. The `client_type: 1` entry is the
/// Android client bound to `com.wargaja.app` and its signing certificate.
const String kGoogleServerClientId =
    '367672341804-51qltcvtg8rh5uku36ar50u6hs294pfj.apps.googleusercontent.com';

/// iOS/macOS OAuth client (type 2) from `GoogleService-Info.plist`.
///
/// Registered in `Info.plist` as `GIDClientID`; kept here so the value has a
/// single, greppable source of truth.
const String kGoogleIosClientId =
    '367672341804-bii0d037kbm3ul6i0erbgnd8oagco9rl.apps.googleusercontent.com';

class GoogleAuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn.instance;

  Future<void>? _initializeFuture;

  /// `GoogleSignIn.initialize` must be awaited exactly once per app process,
  /// so the future is cached instead of being re-run on every sign-in attempt.
  Future<void> _ensureInitialized() {
    return _initializeFuture ??= _googleSignIn.initialize(
      clientId: _platformClientId,
      serverClientId: kGoogleServerClientId,
    );
  }

  /// Apple platforms sign in with their own OAuth client; Android and the web
  /// resolve the client from `google-services.json` / `firebase_options.dart`.
  String? get _platformClientId {
    if (defaultTargetPlatform == TargetPlatform.iOS ||
        defaultTargetPlatform == TargetPlatform.macOS) {
      return kGoogleIosClientId;
    }
    return null;
  }

  /// Returns a Firebase [UserCredential], or `null` if the user cancelled.
  Future<UserCredential?> signInWithGoogle() async {
    if (kIsWeb) {
      // Web flow: the Firebase JS SDK handles the OAuth popup.
      final provider = GoogleAuthProvider();
      return _auth.signInWithPopup(provider);
    }

    await _ensureInitialized();

    final GoogleSignInAccount googleUser;
    try {
      googleUser = await _googleSignIn.authenticate();
    } on GoogleSignInException catch (e) {
      // Closing the account picker is not an error.
      if (e.code == GoogleSignInExceptionCode.canceled) return null;
      rethrow;
    }

    final String? idToken = googleUser.authentication.idToken;
    if (idToken == null) {
      throw FirebaseAuthException(
        code: 'missing-google-id-token',
        message:
            'Google Sign-In did not return an ID token. Check that the '
            'Android OAuth client for this SHA-1 fingerprint and the Web '
            'client ID (serverClientId) belong to the same Firebase project.',
      );
    }

    final credential = GoogleAuthProvider.credential(idToken: idToken);
    return _auth.signInWithCredential(credential);
  }

  Future<void> signOut() async {
    // sign out both firebase and google_sign_in
    await _auth.signOut();
    if (kIsWeb) return;
    try {
      await _googleSignIn.signOut();
    } catch (_) {
      // Already signed out, or the native session was never created. Signing
      // out of Firebase above is what matters for the app's state.
    }
  }
}
