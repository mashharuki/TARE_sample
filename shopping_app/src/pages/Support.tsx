import React from 'react';
import { Headphones, Mail, MessageCircle, Clock, MapPin, Phone } from 'lucide-react';
import { Button, Card } from '../components/common';

export const Support: React.FC = () => {
  const supportOptions = [
    {
      icon: Headphones,
      title: 'お問い合わせ',
      description: '商品や注文についてのご質問',
      action: 'お問い合わせフォーム',
      path: '/contact'
    },
    {
      icon: MessageCircle,
      title: 'チャットサポート',
      description: 'リアルタイムでサポート',
      action: 'チャットを開始',
      path: '/chat'
    },
    {
      icon: Mail,
      title: 'メールサポート',
      description: '24時間以内に返信',
      action: 'メールを送る',
      path: '/email-support'
    }
  ];

  const faqItems = [
    {
      question: '注文のキャンセルは可能ですか？',
      answer: '商品の発送前であればキャンセル可能です。マイページからキャンセル手続きをお願いします。'
    },
    {
      question: '配送料はいくらですか？',
      answer: '全国一律550円（税込）です。10,000円以上のお買い上げで送料無料となります。'
    },
    {
      question: '返品・交換は可能ですか？',
      answer: '商品到着から7日以内であれば返品・交換を承ります。タグを外さずにご連絡ください。'
    },
    {
      question: 'サイズについて相談できますか？',
      answer: '各商品ページにサイズガイドを掲載しています。ご不明な点があればお問い合わせください。'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーローセクション */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-black mb-4">カスタマーサポート</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            LUXEをご利用いただきありがとうございます。
            お困りのことがあれば、お気軽にお問い合わせください。
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* サポートオプション */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {supportOptions.map((option, index) => (
            <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <option.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{option.title}</h3>
              <p className="text-gray-600 mb-6">{option.description}</p>
              <Button className="w-full">
                {option.action}
              </Button>
            </Card>
          ))}
        </div>

        {/* よくある質問 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-12">よくある質問</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">Q</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 営業時間と連絡先 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8">
            <h3 className="text-xl font-semibold text-black mb-6">営業時間</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-black" />
                <div>
                  <p className="font-medium text-black">カスタマーサポート</p>
                  <p className="text-gray-600">平日 9:00-18:00（土日祝除く）</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-black" />
                <div>
                  <p className="font-medium text-black">メールサポート</p>
                  <p className="text-gray-600">24時間受付、24時間以内に返信</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-semibold text-black mb-6">お問い合わせ</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-black" />
                <div>
                  <p className="font-medium text-black">電話番号</p>
                  <p className="text-gray-600">0120-123-456</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-black" />
                <div>
                  <p className="font-medium text-black">メールアドレス</p>
                  <p className="text-gray-600">support@luxe-fashion.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-black" />
                <div>
                  <p className="font-medium text-black">所在地</p>
                  <p className="text-gray-600">〒100-0001 東京都千代田区千代田1-1-1</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};