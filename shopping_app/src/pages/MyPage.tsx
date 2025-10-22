import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Button, Card } from '../components/common';
import { ComingSoon } from '../components/common';

export const MyPage: React.FC = () => {
  const { user } = useAuthStore();
  
  // 注文履歴のモックデータ
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: '配送済み',
      total: 15800,
      items: 3,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20minimalist%20fashion%20order%20confirmation%20icon%2C%20clean%20white%20background%2C%20professional%20style&image_size=square'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: '配送中',
      total: 8900,
      items: 2,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Shipping%20box%20icon%2C%20minimalist%20design%2C%20clean%20white%20background%2C%20professional%20style&image_size=square'
    }
  ];
  
  const menuItems = [
    {
      title: '注文履歴',
      description: '過去の注文を確認',
      icon: Package,
      path: '/orders',
      badge: orders.length
    },
    {
      title: 'お気に入り',
      description: '保存した商品',
      icon: CreditCard,
      path: '/favorites',
      badge: 0
    },
    {
      title: '配送先住所',
      description: '配送情報の管理',
      icon: Clock,
      path: '/addresses',
      badge: null
    }
  ];

  if (!user) {
    return <ComingSoon title="マイページ" message="ログインが必要です。" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">{user.name}さん</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* メニューグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {menuItems.map((item) => (
            <Link key={item.title} to={item.path}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <item.icon className="w-6 h-6 text-black" />
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="flex items-center text-black text-sm font-medium">
                  詳細を見る
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* 最近の注文 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">最近の注文</h2>
            <Link to="/orders" className="text-black hover:text-gray-700 text-sm font-medium">
              すべて見る
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={order.image}
                      alt={order.id}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-semibold text-black">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                      <p className="text-sm text-black">¥{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {order.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{order.items}点</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* アカウント設定 */}
        <div>
          <h2 className="text-xl font-bold text-black mb-6">アカウント設定</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/profile">
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-black mb-2">プロフィール編集</h3>
                <p className="text-sm text-gray-600">個人情報の更新</p>
              </Card>
            </Link>
            <Link to="/settings">
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-black mb-2">設定</h3>
                <p className="text-sm text-gray-600">通知設定・プライバシー</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};