import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { SUBSCRIPTION_PLANS } from './levelSystem';

const REVENUECAT_API_KEY = Platform.OS === 'ios' ? 'your_ios_key' : 'your_android_key';

export async function initRevenueCat(userId: string) {
  if (REVENUECAT_API_KEY === 'your_ios_key') return;
  Purchases.configure({ apiKey: REVENUECAT_API_KEY, appUserID: userId });
}

export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (e) {
    return null;
  }
}

export async function purchasePackage(pkg: any) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (e: any) {
    if (!e.userCancelled) throw e;
    return null;
  }
}

export async function getCustomerInfo() {
  try {
    return await Purchases.getCustomerInfo();
  } catch (e) {
    return null;
  }
}

export async function restorePurchases() {
  try {
    return await Purchases.restorePurchases();
  } catch (e) {
    return null;
  }
}

export function getPlanFromEntitlement(entitlements: any): string {
  if (entitlements?.pro) return 'pro';
  if (entitlements?.premium) return 'premium';
  return 'free';
}

// نظام محلي للمحاكاة (لحين تفعيل RevenueCat الحقيقي)
export function getLocalSubscription(userId: string): string {
  return 'premium'; // مؤقتاً: Premium للتجربة
}
