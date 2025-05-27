import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { NativeWindStyleSheet } from 'nativewind'; // For Tailwind CSS

// Import components
import Auth from './src/components/Auth';
import ListProduce from './src/components/Farmer/ListProduce';
import MarketPrices from './src/components/MarketPrices';
import BuyerDashboard from './src/components/Buyer/BuyerDashboard';

// Import the custom auth hook
import { useAuth } from './src/hooks/useAuth';

// Initialize NativeWind (run this at the root of your app)
NativeWindStyleSheet.setOutput({
  default: 'native',
});

export default function App() {
  const { session, userProfile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('prices'); // 'prices', 'list_produce', 'buyer_dashboard'

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="mt-4 text-lg text-gray-600">Setting up application...</Text>
      </View>
    );
  }

  // If no session, show authentication screen
  if (!session) {
    return <Auth />;
  }

  // Once authenticated and profile is loading or loaded
  if (!userProfile) {
    // This state can happen if user logs in but their public.users entry isn't created yet
    // Or if the profile fetch fails. A real app would guide user to complete profile.
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl text-gray-700">Fetching user details or complete profile...</Text>
        <ActivityIndicator size="small" color="#4CAF50" className="mt-4" />
        <TouchableOpacity
          className="mt-6 bg-red-500 py-3 px-6 rounded-lg shadow-md"
          onPress={() => supabase.auth.signOut()}
        >
          <Text className="text-white font-semibold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }


  const renderContent = () => {
    if (userProfile.user_type === 'farmer') {
      switch (activeTab) {
        case 'prices':
          return <MarketPrices />;
        case 'list_produce':
          return <ListProduce />;
        case 'my_listings': // Placeholder for farmer's own listings
          return (
            <View className="flex-1 justify-center items-center">
              <Text className="text-xl">My Listings (Coming Soon!)</Text>
            </View>
          );
        default:
          return <MarketPrices />;
      }
    } else if (userProfile.user_type === 'buyer') {
      switch (activeTab) {
        case 'prices':
          return <MarketPrices />;
        case 'buyer_dashboard':
          return <BuyerDashboard />;
        case 'my_requests': // Placeholder for buyer's own requests
            return (
              <View className="flex-1 justify-center items-center">
                <Text className="text-xl">My Requests (Coming Soon!)</Text>
              </View>
            );
        default:
          return <BuyerDashboard />;
      }
    }
    return <Text>User type not recognized or profile incomplete.</Text>; // Fallback
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 bg-green-700 shadow-lg flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">FreshConnect</Text>
        <TouchableOpacity onPress={() => supabase.auth.signOut()}>
          <Text className="text-white text-lg font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Tabs */}
      <View className="flex-row justify-around bg-white p-3 border-b border-gray-200">
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${activeTab === 'prices' ? 'bg-green-100' : ''}`}
          onPress={() => setActiveTab('prices')}
        >
          <Text className={`font-semibold ${activeTab === 'prices' ? 'text-green-800' : 'text-gray-600'}`}>
            Market Prices
          </Text>
        </TouchableOpacity>

        {userProfile.user_type === 'farmer' && (
          <>
            <TouchableOpacity
              className={`px-4 py-2 rounded-full ${activeTab === 'list_produce' ? 'bg-green-100' : ''}`}
              onPress={() => setActiveTab('list_produce')}
            >
              <Text className={`font-semibold ${activeTab === 'list_produce' ? 'text-green-800' : 'text-gray-600'}`}>
                List Produce
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-full ${activeTab === 'my_listings' ? 'bg-green-100' : ''}`}
              onPress={() => setActiveTab('my_listings')}
            >
              <Text className={`font-semibold ${activeTab === 'my_listings' ? 'text-green-800' : 'text-gray-600'}`}>
                My Listings
              </Text>
            </TouchableOpacity>
          </>
        )}

        {userProfile.user_type === 'buyer' && (
          <>
            <TouchableOpacity
              className={`px-4 py-2 rounded-full ${activeTab === 'buyer_dashboard' ? 'bg-green-100' : ''}`}
              onPress={() => setActiveTab('buyer_dashboard')}
            >
              <Text className={`font-semibold ${activeTab === 'buyer_dashboard' ? 'text-green-800' : 'text-gray-600'}`}>
                Buy Produce
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-full ${activeTab === 'my_requests' ? 'bg-green-100' : ''}`}
              onPress={() => setActiveTab('my_requests')}
            >
              <Text className={`font-semibold ${activeTab === 'my_requests' ? 'text-green-800' : 'text-gray-600'}`}>
                My Requests
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Main Content Area */}
      <View className="flex-1">
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}