import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { NotificationService } from './notificationService';

const STORAGE_KEY = 'talk2trade-products';

export const ProductService = {
  async getProducts() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const products = JSON.parse(stored);
        return products.map(p => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        }));
      }
    } catch (error) {
      console.warn('Failed to load products from storage:', error);
    }
    return getDefaultProducts();
  },

  async saveProducts(products) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save products to storage:', error);
    }
  },

  async addProduct(productData) {
    const products = await this.getProducts();
    const netInfo = await NetInfo.fetch();
    const isOnline = netInfo.isConnected;

    const newProduct = {
      ...productData,
      id: Date.now(),
      offline: !isOnline,
      synced: isOnline,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProducts = [...products, newProduct];
    await this.saveProducts(updatedProducts);

    NotificationService.productAdded(newProduct.name);
    return newProduct;
  },

  async updateProduct(id, productData) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedProduct = {
      ...products[index],
      ...productData,
      updatedAt: new Date(),
    };

    products[index] = updatedProduct;
    await this.saveProducts(products);

    NotificationService.productUpdated(updatedProduct.name);
    return updatedProduct;
  },

  async deleteProduct(id) {
    const products = await this.getProducts();
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return false;

    const updatedProducts = products.filter(p => p.id !== id);
    await this.saveProducts(updatedProducts);

    NotificationService.productDeleted(productToDelete.name);
    return true;
  },
};

function getDefaultProducts() {
  const now = new Date();
  return [
    {
      id: 1,
      name: "Cotton Saree",
      description:
        "Beautiful handwoven cotton saree with traditional patterns, perfect for festivals and special occasions",
      category: "Clothing",
      price: 2500,
      quantity: 5,
      localInput: "सूती साड़ी पारंपरिक डिज़ाइन के साथ",
      translatedInput: "Cotton saree with traditional design",
      offline: false,
      synced: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      name: "Organic Turmeric Powder",
      description:
        "Pure organic turmeric powder sourced from local farms, 100% natural with no artificial additives",
      category: "Spices",
      price: 120,
      quantity: 25,
      localInput: "हल्दी पाउडर जैविक",
      translatedInput: "Turmeric powder organic",
      offline: true,
      synced: false,
      createdAt: now,
      updatedAt: now,
    },
  ];
}
