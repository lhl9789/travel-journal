import * as ImagePicker from 'expo-image-picker'

/**
 * 갤러리에서 커버 이미지 1장을 선택한다 (PRD 3.1).
 * 권한이 없거나 선택을 취소하면 null을 반환한다.
 */
export async function pickCoverImage(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!permission.granted) {
    return null
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  })

  if (result.canceled || result.assets.length === 0) {
    return null
  }

  return result.assets[0].uri
}
