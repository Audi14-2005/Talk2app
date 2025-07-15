import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, TouchableOpacity,
  FlatList, ActivityIndicator, StyleSheet
} from 'react-native';
import Voice from '@react-native-voice/voice'; // or your voice library
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductService } from '../services/productService';
import { SettingsService } from '../services/settingsService';
import { NotificationService } from '../services/notificationService';

import SettingsScreen from '../components/SettingsScreen';
import VoiceInputComponent from '../components/VoiceInputComponent';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation, products, settings, onGenerate }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Talk2Trade</Text>
      <VoiceInputComponent
        onGenerate={onGenerate}
        onTextEdit={() => navigation.navigate('TextInput')}
      />
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text>View Products ({products.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TextInputScreen({ route, navigation, onGenerate, isGenerating }) {
  const [text, setText] = useState(route.params?.text || '');
  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Text>Manual Entry</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="Describe your product..."
        value={text}
        onChangeText={setText}
      />
      {isGenerating ?
        <ActivityIndicator /> :
        <Button title="Generate" onPress={() => onGenerate(text)} disabled={!text} />
      }
    </View>
  );
}

function DashboardScreen({ navigation, products, onEdit, onDelete }) {
  const [query, setQuery] = useState('');
  const filtered = Array.isArray(products) ? products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Text>Product Catalog</Text>
        <Button title="Add" onPress={() => navigation.navigate('AddProduct')} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search products..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.category} · ₹{item.price} · Stock: {item.quantity}</Text>
            <View style={styles.actionRow}>
              <Button title="Edit" onPress={() => onEdit(item)} />
              <Button title="Delete" color="red" onPress={() => onDelete(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No products.</Text>}
      />
    </View>
  );
}

function AddProductScreen({ navigation, route, onSave, isGenerating, formData, setFormData }) {
  const { editingProduct } = route.params || {};
  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Text>{editingProduct ? 'Edit Product' : 'Add Product'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Name*"
        value={formData.name}
        onChangeText={text => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={formData.category}
        onChangeText={text => setFormData({ ...formData, category: text })}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Description"
        multiline
        value={formData.description}
        onChangeText={text => setFormData({ ...formData, description: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={formData.price}
        onChangeText={text => setFormData({ ...formData, price: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        keyboardType="numeric"
        value={formData.quantity}
        onChangeText={text => setFormData({ ...formData, quantity: text })}
      />
      <View style={styles.saveRow}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        {isGenerating ?
          <ActivityIndicator /> :
          <Button title="Save" onPress={() => onSave(navigation, editingProduct)} disabled={!formData.name} />
        }
      </View>
    </View>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(SettingsService.getSettings());
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', category: '',
    price: '', quantity: '', localInput: '', translatedInput: ''
  });
  const [currentEdit, setCurrentEdit] = useState(null);

  useEffect(() => {
    ProductService.getProducts().then(setProducts);
  }, []);

  // Offline sync placeholder
  useEffect(() => {
    const onOnline = () => NotificationService.syncComplete();
    const onOffline = () => settings.offlineMode && NotificationService.offlineMode();
    // RN NetInfo hook would go here
  }, [settings.offlineMode]);

  const generateDescription = (desc, original = '') => {
    setIsGenerating(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        description: desc,
        localInput: original,
        translatedInput: desc
      }));
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = async (navigation, editing) => {
    const { name, description, category, price, quantity, localInput, translatedInput } = formData;
    if (!name.trim()) {
      NotificationService.error('Product name is required');
      Toast.show({ type: 'error', text1: 'Error', text2: 'Name required' });
      return;
    }
    const payload = { name, description, category, price: parseFloat(price) || 0, quantity: parseInt(quantity) || 0, localInput, translatedInput };
    if (editing) {
      await ProductService.updateProduct(editing.id, payload);
    } else {
      await ProductService.addProduct(payload);
    }
    const updatedProducts = await ProductService.getProducts();
    setProducts(updatedProducts);
    navigation.navigate('Dashboard');
  };

  const handleEdit = item => {
    setCurrentEdit(item);
    setFormData({
      name: item.name, description: item.description, category: item.category,
      price: item.price.toString(), quantity: item.quantity.toString(),
      localInput: item.localInput || '', translatedInput: item.translatedInput || ''
    });
  };

  const handleDelete = async id => {
    await ProductService.deleteProduct(id);
    const updatedProducts = await ProductService.getProducts();
    setProducts(updatedProducts);
  };

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {props => (
            <HomeScreen
              {...props}
              products={products}
              settings={settings}
              onGenerate={text => {
                generateDescription(text);
                props.navigation.navigate('AddProduct', { editingProduct: null });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="TextInput">
          {props => (
            <TextInputScreen
              {...props}
              onGenerate={desc => {
                generateDescription(desc);
                props.navigation.navigate('AddProduct', { editingProduct: null });
              }}
              isGenerating={isGenerating}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Dashboard">
          {props => (
            <DashboardScreen
              {...props}
              products={products}
              onEdit={item => {
                handleEdit(item);
                props.navigation.navigate('AddProduct', { editingProduct: item });
              }}
              onDelete={handleDelete}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AddProduct">
          {props => (
            <AddProductScreen
              {...props}
              editingProduct={currentEdit}
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              isGenerating={isGenerating}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Settings">
          {props => (
            <SettingsScreen
              {...props}
              settings={settings}
              onSettingsChange={setSettings}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 32 },
  actionBtn: { padding: 16, backgroundColor: '#eee', borderRadius: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginVertical: 8, padding: 8 },
  textArea: { height: 100, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, textAlignVertical: 'top', marginVertical: 8 },
  productCard: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginVertical: 4 },
  productName: { fontWeight: 'bold', marginBottom: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  saveRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
});
