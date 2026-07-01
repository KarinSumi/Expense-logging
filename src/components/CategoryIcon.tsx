import React from 'react';
import { 
  ShoppingCart, 
  Utensils, 
  Tv, 
  Car, 
  CreditCard, 
  Info 
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, className = "w-5 h-5 text-indigo-500" }) => {
  switch (iconName) {
    case 'shopping_cart':
    case 'ช้อปปิ้ง':
      return <ShoppingCart className={className} />;
    case 'utensils':
    case 'อาหารและเครื่องดื่ม':
      return <Utensils className={className} />;
    case 'tv':
    case 'บิลและค่าใช้จ่าย':
    case 'Netflix':
      return <Tv className={className} />;
    case 'car':
    case 'การเดินทาง':
      return <Car className={className} />;
    case 'credit_card':
    case 'เงินเดือน':
    case 'การลงทุน':
    case 'โบนัส':
      return <CreditCard className={className} />;
    default:
      return <Info className={className} />;
  }
};
export default CategoryIcon;
