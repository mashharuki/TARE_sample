import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ブランド情報 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-black mb-4">LUXE</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              上質なファッションアイテムをお届けする、日本の女性向けファッションECサイト。
              トレンドとタイムレスなデザインを融合させた、あなただけのスタイルを提案します。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-black transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* カスタマーサポート */}
          <div>
            <h4 className="font-semibold text-black mb-4">カスタマーサポート</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/support" className="text-gray-600 hover:text-black transition-colors">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-black transition-colors">
                  配送について
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-black transition-colors">
                  返品・交換
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-600 hover:text-black transition-colors">
                  サイズガイド
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-black transition-colors">
                  よくある質問
                </Link>
              </li>
            </ul>
          </div>

          {/* マイページ */}
          <div>
            <h4 className="font-semibold text-black mb-4">マイページ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-black transition-colors">
                  ログイン
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-black transition-colors">
                  会員登録
                </Link>
              </li>
              <li>
                <Link to="/mypage" className="text-gray-600 hover:text-black transition-colors">
                  マイページ
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 hover:text-black transition-colors">
                  注文履歴
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-600 hover:text-black transition-colors">
                  お気に入り
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 連絡先情報 */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail size={16} />
              <span>support@luxe-fashion.jp</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={16} />
              <span>0120-123-456（平日10:00-18:00）</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>東京都渋谷区〇〇1-2-3</span>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 LUXE. All rights reserved. | 
            <Link to="/privacy" className="hover:text-black transition-colors ml-2">
              プライバシーポリシー
            </Link>
            {' | '}
            <Link to="/terms" className="hover:text-black transition-colors">
              利用規約
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};