import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS, REVIEWS } from '../data/mock';
import { Button } from '../components/common';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  // 商品データを取得
  const product = PRODUCTS.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">商品が見つかりません</h1>
          <p className="text-gray-600">お探しの商品は存在しません。</p>
        </div>
      </div>
    );
  }

  // 商品のレビューを取得
  const productReviews = REVIEWS.filter(review => review.product_id === product.id);
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length 
    : 0;

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('サイズとカラーを選択してください。');
      return;
    }
    // カートに追加する処理を実装
    alert('カートに追加しました！');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 商品画像 */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* 画像ナビゲーション */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              
              {/* 画像インジケーター */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === selectedImage ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* サムネイル画像 */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImage ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 商品情報 */}
          <div className="space-y-6">
            {/* 商品ヘッダー */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.brand}
                </span>
                <button
                  onClick={() => setIsWishlist(!isWishlist)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    size={20}
                    className={isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                  />
                </button>
              </div>
              <h1 className="text-3xl font-bold text-black mb-4">{product.name}</h1>
              
              {/* 評価 */}
              {productReviews.length > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(averageRating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({productReviews.length}件のレビュー)
                  </span>
                </div>
              )}
              
              <p className="text-3xl font-bold text-black">¥{product.price.toLocaleString()}</p>
            </div>

            {/* 商品説明 */}
            <div>
              <h3 className="font-semibold text-black mb-2">商品説明</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* サイズ選択 */}
            <div>
              <h3 className="font-semibold text-black mb-3">サイズ</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* カラー選択 */}
            <div>
              <h3 className="font-semibold text-black mb-3">カラー</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg transition-all ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* 数量選択 */}
            <div>
              <h3 className="font-semibold text-black mb-3">数量</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* 在庫状況 */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                product.stock_quantity > 10 ? 'bg-green-500' : 
                product.stock_quantity > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {product.stock_quantity > 0 
                  ? `在庫あり（残り${product.stock_quantity}点）`
                  : '在庫切れ'
                }
              </span>
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full"
                size="lg"
              >
                <ShoppingBag className="mr-2" size={20} />
                カートに追加
              </Button>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsWishlist(!isWishlist)}
                >
                  <Heart
                    size={16}
                    className={`mr-2 ${isWishlist ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  お気に入り
                </Button>
                <Button variant="outline">
                  <Share2 size={16} className="mr-2" />
                  シェア
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* レビューセクション */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-black mb-8">商品レビュー</h2>
            
            {productReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">まだレビューがありません。</p>
                <p className="text-sm text-gray-400 mt-2">この商品を購入して、最初のレビューを書いてみませんか？</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* レビュー統計 */}
                <div className="flex items-center space-x-8 pb-6 border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-black">{averageRating.toFixed(1)}</div>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(averageRating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{productReviews.length}件</div>
                  </div>
                  <div className="flex-1">
                    {/* レーティング分布 */}
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = productReviews.filter(r => r.rating === rating).length;
                      const percentage = (count / productReviews.length) * 100;
                      return (
                        <div key={rating} className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-gray-600 w-4">{rating}</span>
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* レビューリスト */}
                <div className="space-y-6">
                  {productReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {review.user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-black">{review.user.name}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString('ja-JP')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      {review.is_verified_purchase && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            購入済み
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};