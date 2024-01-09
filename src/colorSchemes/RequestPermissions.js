import { Alert, Platform } from "react-native";
import { PERMISSIONS, RESULTS, requestMultiple } from "react-native-permissions";

export const requestCameraAndGalleryPermissions = () => {
    if (Platform.OS == "ios") {
        requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]).then((statuses) => {
            console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
            console.log('FaceID', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
            if ((statuses[PERMISSIONS.IOS.CAMERA] == RESULTS.GRANTED) && (statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] == RESULTS.GRANTED)) {
                return true
            }
            else {
                if (statuses[PERMISSIONS.IOS.CAMERA] !== RESULTS.GRANTED) {
                    Alert.alert("Camera is not accessible")
                    return false
                }
                else if (statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] !== RESULTS.GRANTED) {
                    Alert.alert("Photo Library is not accessible")
                    return false
                }
            }
        });
    }

}

