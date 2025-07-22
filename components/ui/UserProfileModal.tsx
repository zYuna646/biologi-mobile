import { GameButton } from '@/components/ui/GameButton';
import { Config } from '@/constants/Config';
import { User, UserService } from '@/utils/UserService';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface UserProfileModalProps {
  visible: boolean;
  user?: User | null;
  onClose: () => void;
  onUserSaved: (user: User) => void;
  isNewUser?: boolean;
}

const { width, height } = Dimensions.get('window');

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  visible,
  user,
  onClose,
  onUserSaved,
  isNewUser = false,
}) => {
  const [name, setName] = useState(user?.name || '');
  const [userClass, setUserClass] = useState(user?.class || '');
  const [loading, setLoading] = useState(false);
  
  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Nama tidak boleh kosong');
      return false;
    }
    if (!userClass.trim()) {
      Alert.alert('Error', 'Kelas tidak boleh kosong');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let savedUser: User;

      if (isNewUser || !user?.id) {
        // Create new user
        const deviceToken = UserService.getDeviceToken();
        savedUser = await UserService.createUser({
          device_token: deviceToken,
          name: name.trim(),
          class: userClass.trim(),
        });
      } else {
        // Update existing user
        savedUser = await UserService.updateUser(user.id, {
          name: name.trim(),
          class: userClass.trim(),
        });
      }

      onUserSaved(savedUser);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Error', 'Gagal menyimpan profil. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isNewUser) {
      Alert.alert(
        'Profil Diperlukan',
        'Anda harus mengisi profil sebelum dapat menggunakan aplikasi.',
        [{ text: 'OK' }]
      );
      return;
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, {
          paddingHorizontal: isTablet ? 30 : 20,
          paddingVertical: isTablet ? 20 : 15,
        }]}>
          {!isNewUser && (
            <TouchableOpacity 
              style={[styles.cancelButton, {
                width: isTablet ? 50 : 40,
                height: isTablet ? 50 : 40,
                borderRadius: isTablet ? 25 : 20,
              }]} 
              onPress={handleCancel}
            >
              <Text style={[styles.cancelText, {
                fontSize: isTablet ? 20 : 18,
              }]}>✕</Text>
            </TouchableOpacity>
          )}
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, {
              fontSize: isTablet ? 28 : isSmallScreen ? 20 : 24,
            }]}>
              {isNewUser ? '👋 Selamat Datang!' : '👤 Edit Profil'}
            </Text>
            {isNewUser && (
              <Text style={[styles.headerSubtitle, {
                fontSize: isTablet ? 16 : isSmallScreen ? 13 : 14,
              }]}>
                Mari siapkan profil Anda untuk memulai petualangan belajar!
              </Text>
            )}
          </View>
          {!isNewUser && <View style={styles.placeholder} />}
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={[styles.scrollContent, {
            paddingHorizontal: isTablet ? 40 : 20,
            paddingBottom: isTablet ? 40 : 30,
          }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isNewUser && (
            <View style={[styles.welcomeSection, {
              marginBottom: isTablet ? 40 : 30,
              padding: isTablet ? 30 : 20,
            }]}>
              <View style={styles.welcomeIcon}>
                <Text style={[styles.welcomeEmoji, {
                  fontSize: isTablet ? 80 : isSmallScreen ? 50 : 60,
                }]}>🌱</Text>
              </View>
              <Text style={[styles.welcomeTitle, {
                fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
              }]}>
                Selamat Datang di Biologi Edukasi!
              </Text>
              <Text style={[styles.welcomeText, {
                fontSize: isTablet ? 16 : isSmallScreen ? 13 : 14,
              }]}>
                Sebelum memulai petualangan belajar yang menyenangkan, mari kenalan terlebih dahulu dengan mengisi profil Anda.
              </Text>
            </View>
          )}

          {/* Form */}
          <View style={[styles.form, {
            gap: isTablet ? 30 : 25,
          }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, {
                fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
                marginBottom: isTablet ? 12 : 10,
              }]}>
                📝 Nama Lengkap
              </Text>
              <TextInput
                style={[styles.input, {
                  fontSize: isTablet ? 18 : isSmallScreen ? 15 : 16,
                  paddingHorizontal: isTablet ? 20 : 16,
                  paddingVertical: isTablet ? 18 : 14,
                  borderRadius: isTablet ? 16 : 12,
                }]}
                value={name}
                onChangeText={setName}
                placeholder="Masukkan nama lengkap Anda"
                placeholderTextColor={Config.GAME_THEME.TEXT_SECONDARY}
                autoCapitalize="words"
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, {
                fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
                marginBottom: isTablet ? 12 : 10,
              }]}>
                🎒 Kelas
              </Text>
              <TextInput
                style={[styles.input, {
                  fontSize: isTablet ? 18 : isSmallScreen ? 15 : 16,
                  paddingHorizontal: isTablet ? 20 : 16,
                  paddingVertical: isTablet ? 18 : 14,
                  borderRadius: isTablet ? 16 : 12,
                }]}
                value={userClass}
                onChangeText={setUserClass}
                placeholder="Contoh: 10A, 11 IPA 2, dst."
                placeholderTextColor={Config.GAME_THEME.TEXT_SECONDARY}
                autoCapitalize="characters"
                maxLength={20}
              />
            </View>
          </View>

          {/* Save Button */}
          <View style={[styles.buttonContainer, {
            marginTop: isTablet ? 50 : 40,
            marginBottom: isTablet ? 30 : 20,
          }]}>
            <GameButton
              title={loading ? 'Menyimpan...' : (isNewUser ? 'Mulai Petualangan! 🚀' : 'Simpan Profil')}
              onPress={handleSave}
              variant="primary"
              size={isTablet ? "large" : "medium"}
              disabled={loading}
              icon={<Text style={[styles.buttonIcon, {
                fontSize: isTablet ? 18 : 16,
              }]}>
                {isNewUser ? '🚀' : '💾'}
              </Text>}
            />
          </View>

          {user?.created_at && !isNewUser && (
            <View style={styles.infoSection}>
              <Text style={[styles.infoText, {
                fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
              }]}>
                📅 Bergabung sejak: {new Date(user.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Config.GAME_THEME.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: Config.GAME_THEME.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.8,
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
  },
  welcomeSection: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeIcon: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeEmoji: {
    // fontSize handled dynamically
  },
  welcomeTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    // gap handled dynamically
  },
  inputGroup: {
    // marginBottom handled by form gap
  },
  label: {
    fontWeight: '700',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    // fontSize and marginBottom handled dynamically
  },
  input: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderWidth: 2,
    borderColor: Config.GAME_THEME.BACKGROUND,
    color: Config.GAME_THEME.TEXT_PRIMARY,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    // fontSize, padding, borderRadius handled dynamically
  },
  buttonContainer: {
    // marginTop and marginBottom handled dynamically
  },
  buttonIcon: {
    // fontSize handled dynamically
  },
  infoSection: {
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
  },
  infoText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontStyle: 'italic',
    textAlign: 'center',
  },
}); 