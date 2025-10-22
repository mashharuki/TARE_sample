import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { PRODUCTS } from '../data/mock';
import { Button } from '../components/common';

export const Home: React.FC = () => {
  // 新着商品（最新3件）
  const newArrivals = PRODUCTS.slice(0, 3);
  
  // 人気商品（ランダムに3件選択）
  const popularItems = PRODUCTS.slice(3, 6);

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="relative h-[70vh] bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20model%20elegant%20pose%20minimalist%20background%20professional%20photography%20black%20and%20white%20monochrome%20style&image_size=landscape_16_9')`
          }}
        ></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              新しいあなたへ
              <br />
              <span className="text-gray-300">最上級のスタイルを</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              上質な素材と洗練されたデザインが織りなす、特別なファッション体験。
              あなただけの個性を輝かせるアイテムを見つけてください。
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                商品を見る
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 新着アイテムセクション */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-black">新着アイテム</h2>
            <Link 
              to="/products?sort=new" 
              className="flex items-center text-black hover:text-gray-700 transition-colors"
            >
              すべて見る
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 人気商品セクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-black">人気の商品</h2>
            <Link 
              to="/products?sort=popular" 
              className="flex items-center text-black hover:text-gray-700 transition-colors"
            >
              すべて見る
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularItems.map((product) => (
              <ProductCard key={product.id} product={product} showRating />
            ))}
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">LUXEの特徴</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              私たちは、お客様に最高のショッピング体験をお届けすることに情熱を注いでいます。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="厳選された品質"
              description="素材から縫製まで、一つ一つにこだわった上質なアイテムのみを厳選してお届けします。"
              icon="✨"
            />
            <FeatureCard 
              title="迅速な配送"
              description="注文から最短翌日配送。お急ぎの場合も、素早く確実にお届けいたします。"
              icon="🚚"
            />
            <FeatureCard 
              title="安心のサポート"
              description="専門スタッフがお客様のお問い合わせに迅速かつ丁寧に対応いたします。"
              icon="💬"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// 商品カードコンポーネント
interface ProductCardProps {
  product: typeof PRODUCTS[0];
  showRating?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showRating = false }) => {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
            {product.name}
          </h3>
          {showRating && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">(4.5)</span>
            </div>
          )}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-black">
              ¥{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              {product.colors.length}色展開
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// 特徴カードコンポーネント
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};