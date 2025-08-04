# Deno Fresh vs Expo 開発体験比較

実際に同じアプリを両方で作ってみた比較です。

## 🎯 結論：用途で使い分け

- **Webアプリ → Deno Fresh** が書きやすい
- **モバイルアプリ → Expo** が書きやすい

## 📝 書きやすさ比較

### Deno Fresh の方が書きやすい点

#### 1. **シンプルな構成**
```typescript
// Deno Fresh - すぐ書ける
export default function Component() {
  return <div>Hello</div>;
}
```

```typescript
// Expo - 設定が多い
import { View, Text } from 'react-native';
export default function Component() {
  return <View><Text>Hello</Text></View>;
}
```

#### 2. **Web標準が使える**
```typescript
// Deno Fresh - 普通のHTML/CSS
<button class="bg-blue-500 text-white p-2">
  クリック
</button>
```

```typescript
// Expo - StyleSheetが必要
<TouchableOpacity style={styles.button}>
  <Text style={styles.buttonText}>クリック</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  button: { backgroundColor: 'blue', padding: 8 },
  buttonText: { color: 'white' }
});
```

#### 3. **TypeScript設定不要**
- Deno Fresh: 最初からTypeScript対応
- Expo: tsconfig.json等の設定が必要

### Expo の方が書きやすい点

#### 1. **モバイル最適化コンポーネント**
```typescript
// Expo - スワイプが簡単
<PanGestureHandler onGestureEvent={handleSwipe}>
  <Animated.View>...</Animated.View>
</PanGestureHandler>
```

```typescript
// Deno Fresh - 自分で実装
const handleTouchStart = (e: TouchEvent) => { /* ... */ };
const handleTouchMove = (e: TouchEvent) => { /* ... */ };
const handleTouchEnd = (e: TouchEvent) => { /* ... */ };
```

#### 2. **クロスプラットフォーム**
```typescript
// Expo - iOS/Android/Web全対応
Platform.select({
  ios: { shadowColor: 'black' },
  android: { elevation: 4 },
  web: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
})
```

#### 3. **リッチなアニメーション**
```typescript
// Expo - Reanimated2が強力
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: withSpring(x.value) }]
}));
```

## 📊 具体的な比較

| 項目 | Deno Fresh | Expo |
|------|------------|------|
| **初期設定** | ⭐⭐⭐⭐⭐ 即開始 | ⭐⭐⭐ 設定多め |
| **TypeScript** | ⭐⭐⭐⭐⭐ 標準対応 | ⭐⭐⭐⭐ 設定必要 |
| **スタイリング** | ⭐⭐⭐⭐⭐ Tailwind使える | ⭐⭐⭐ StyleSheet面倒 |
| **Firebase連携** | ⭐⭐⭐⭐ Web SDK | ⭐⭐⭐ 設定複雑 |
| **デプロイ** | ⭐⭐⭐⭐⭐ 超簡単 | ⭐⭐⭐ ビルド必要 |
| **パフォーマンス** | ⭐⭐⭐⭐ Islands最適化 | ⭐⭐⭐⭐ ネイティブ高速 |
| **モバイル機能** | ⭐⭐ Web制限あり | ⭐⭐⭐⭐⭐ フル機能 |
| **デバッグ** | ⭐⭐⭐⭐ ブラウザ標準 | ⭐⭐⭐ Metro複雑 |

## 🤔 実際の開発で感じた違い

### Deno Fresh
```typescript
// 良い：HTMLそのまま書ける感覚
<div class="flex items-center gap-4 p-4 bg-white rounded-lg">
  <input type="checkbox" onChange={handleChange} />
  <span>{text}</span>
</div>
```

### Expo
```typescript
// 面倒：View/Text変換、スタイル定義
<View style={styles.container}>
  <Switch value={checked} onValueChange={handleChange} />
  <Text style={styles.text}>{text}</Text>
</View>
```

## 💡 使い分けの指針

### Deno Fresh を選ぶべき時
✅ **Webファースト**のサービス
✅ **SEO重要**
✅ **開発速度優先**
✅ **シンプルなUI**で十分
✅ **個人開発・プロトタイプ**

### Expo を選ぶべき時
✅ **モバイルファースト**のサービス
✅ **ネイティブ機能**が必要（カメラ、通知等）
✅ **リッチなUX**が必要
✅ **App Store配信**予定
✅ **チーム開発**（React Native経験者多い）

## 🎉 個人的な感想

**Deno Fresh の方が書きやすい！**

理由：
1. **設定地獄がない** - すぐコード書ける
2. **Web標準** - HTML/CSS知識がそのまま使える
3. **Tailwind最高** - スタイル定義不要
4. **デプロイ簡単** - git pushだけ
5. **TypeScript快適** - 設定ゼロ

ただし、**モバイルアプリ作るならExpo一択**。
スワイプやアニメーションの実装が圧倒的に楽。

## 📌 まとめ

- **Webアプリ作るなら** → Deno Fresh（開発体験最高）
- **モバイルアプリ作るなら** → Expo（機能豊富）
- **両方対応したいなら** → Expo（でもWeb版は微妙）

今回のスケジュールアプリは**Webメイン**だったので、
**Deno Freshが圧倒的に書きやすかった**です。