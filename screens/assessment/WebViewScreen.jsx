import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  StatusBar,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setOngoing } from "../../services/slice/ongoing";
import { fonts } from "../../utils/font";

const WebViewScreen = ({ route, navigation }) => {
  const { url, title = "Web View" } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
  const webViewRef = useRef(null);
  const dispatch = useDispatch();

  useState(() => {
    dispatch(setOngoing("WebView"));
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: currentUrl,
        url: currentUrl, // iOS only
      });
    } catch (error) {
      Alert.alert("Error", "Something went wrong while sharing");
    }
  };

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
  };

  const handleGoBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      navigation.goBack();
    }
  };

  const handleGoForward = () => {
    if (canGoForward && webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#233D90" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text numberOfLines={1} style={styles.headerTitle}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.headerUrl}>
            {currentUrl}
          </Text>
        </View>

        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <MaterialIcons name="share" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => null} // We'll handle loading UI manually
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView error: ", nativeEvent);
          }}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#233D90" />
          </View>
        )}
      </View>

      {/* Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={[styles.navButton, !canGoBack && styles.navButtonDisabled]}
          disabled={!canGoBack}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={canGoBack ? "#233D90" : "#9CA3AF"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoForward}
          style={[styles.navButton, !canGoForward && styles.navButtonDisabled]}
          disabled={!canGoForward}
        >
          <MaterialIcons
            name="arrow-forward"
            size={24}
            color={canGoForward ? "#233D90" : "#9CA3AF"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRefresh} style={styles.navButton}>
          <MaterialIcons name="refresh" size={24} color="#233D90" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.navButton}
        >
          <MaterialIcons name="close" size={24} color="#233D90" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#233D90",
    paddingVertical: 12,
    paddingHorizontal: 8,
    paddingTop: 50, // Account for status bar
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  headerButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 8,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  headerUrl: {
    color: "#E5E7EB",
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  webViewContainer: {
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  navigationBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "space-around",
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  navButtonDisabled: {
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: fonts.medium,
  },
  errorMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: fonts.regular,
  },
});

export default WebViewScreen;
