import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { cn } from '../../utils';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigationItems = [
    { name: '新着アイテム', href: '/products?sort=new' },
    { name: 'トップス', href: '/products?category=tops' },
    { name: 'ボトムス', href: '/products?category=bottoms' },
    { name: 'ワンピース', href: '/products?category=dresses' },
    { name: 'アウター', href: '/products?category=outerwear' },
    { name: 'アクセサリー', href: '/products?category=accessories' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* トップバー */}
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link to="/" className="text-2xl font-bold text-black hover:text-gray-700 transition-colors">
            LUXE
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* アイコンエリア */}
          <div className="flex items-center space-x-4">
            {/* 検索ボタン */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-black transition-colors"
              aria-label="検索"
            >
              <Search size={20} />
            </button>

            {/* ユーザーボタン */}
            <Link
              to="/login"
              className="p-2 text-gray-700 hover:text-black transition-colors"
              aria-label="マイページ"
            >
              <User size={20} />
            </Link>

            {/* カートボタン */}
            <Link
              to="/cart"
              className="p-2 text-gray-700 hover:text-black transition-colors relative"
              aria-label="カート"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-black transition-colors"
              aria-label="メニュー"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* 検索バー */}
        <div className={cn(
          'border-t border-gray-200 py-4 transition-all duration-300',
          isSearchOpen ? 'block' : 'hidden'
        )}>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="商品を検索..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* モバイルメニュー */}
        <div className={cn(
          'md:hidden border-t border-gray-200',
          isMenuOpen ? 'block' : 'hidden'
        )}>
          <nav className="py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};