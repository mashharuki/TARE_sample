import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { Button } from '../components/common';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      const item = items.find(i => i.id === itemId);
      if (item) {
        removeItem(item.product_id, item.size, item.color);
      }
    } else {
      const item = items.find(i => i.id === itemId);
      if (item) {
        updateQuantity(item.product_id, item.size, item.color, newQuantity);
      }
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      removeItem(item.product_id, item.size, item.color);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">カートは空です</h1>
          <p className="text-gray-600 mb-6">お気に入りの商品を見つけて、ショッピングを始めましょう！</p>
          <Link to="/products">
            <Button>
              商品を見る
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">ショッピングカート</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* カートアイテム */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* 商品画像 */}
                  <div className="md:w-32 md:h-32 w-full h-48 flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* 商品情報 */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-black mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.product.brand}
                        </p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>サイズ: {item.size}</p>
                          <p>カラー: {item.color}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    {/* 価格と数量 */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-lg font-bold text-black">
                        ¥{item.product.price.toLocaleString()}
                      </div>
                      
                      {/* 数量選択 */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* 小計 */}
                    <div className="text-right mt-2">
                      <span className="text-sm text-gray-600">小計: </span>
                      <span className="font-semibold text-black">
                        ¥{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 注文概要 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-black mb-6">注文概要</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">商品小計</span>
                  <span className="font-medium">¥{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">配送料</span>
                  <span className="font-medium">¥0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">消費税</span>
                  <span className="font-medium">¥{Math.floor(getTotalPrice() * 0.1).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">合計</span>
                    <span className="font-bold text-xl text-black">
                      ¥{Math.floor(getTotalPrice() * 1.1).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <Link to="/checkout">
                <Button className="w-full mb-4">
                  レジへ進む
                </Button>
              </Link>
              
              <Link to="/products">
                <Button variant="outline" className="w-full">
                  買い物を続ける
                </Button>
              </Link>
              
              {/* 配送情報 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-black mb-3">配送について</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 送料無料（¥10,000以上のご注文）</li>
                  <li>• 通常2-3営業日で発送</li>
                  <li>• 返品・交換可能（30日以内）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};