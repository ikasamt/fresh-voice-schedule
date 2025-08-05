# Flutter to Deno Fresh Migration Guide

## Architecture Mapping

### Flutter → Fresh
- **StatefulWidget** → Island Component with `useState`/`useSignal`
- **StatelessWidget** → Regular Preact Component
- **Navigator** → File-based routing in `routes/`
- **Provider/Riverpod** → Props drilling or global state
- **Firebase SDK** → Web SDK with dynamic imports

## Key Differences

### State Management
```typescript
// Flutter: setState
setState(() => counter++);

// Fresh: useState
const [counter, setCounter] = useState(0);
setCounter(counter + 1);
```

### Routing
```typescript
// Flutter: Navigator.push
Navigator.push(context, MaterialPageRoute(...));

// Fresh: <a> or location.href
<a href="/new-page">Navigate</a>
```

### Async Operations
```typescript
// Flutter: FutureBuilder
FutureBuilder<Data>(future: fetchData(), ...);

// Fresh: useEffect + useState
useEffect(() => {
  fetchData().then(setData);
}, []);
```

## Firebase Integration

### Authentication
```typescript
// Dynamic import to avoid SSR issues
const { auth, signInWithPopup, GoogleAuthProvider } = await import("../utils/firebase.ts");
```

### Firestore
```typescript
// Real-time updates
onSnapshot(query, (snapshot) => {
  const items = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setItems(items);
});
```

## UI Components

### Gesture Detection
```typescript
// Flutter: GestureDetector
GestureDetector(onTap: ..., onPanUpdate: ...);

// Fresh: Touch/Mouse events
<div 
  onTouchStart={...}
  onTouchMove={...}
  onMouseDown={...}
/>
```

### Animation
```typescript
// Flutter: AnimationController
AnimationController(duration: ...);

// Fresh: CSS transitions
<div class={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
```

## Mobile-Specific

### Swipe Actions
```typescript
// Prevent pull-to-refresh
e.preventDefault();
// CSS
overscroll-behavior-y: contain;
```

### Touch Handling
```typescript
const touch = e.touches[0] || e;
const clientX = touch.clientX;
```

## Islands Architecture

### When to use Islands
- Components with `useState`, `useEffect`
- Interactive elements (modals, forms)
- Real-time data updates

### Static Components
- Display-only components
- Layout components
- Server-rendered content

## File Structure
```
routes/
  index.tsx          # Main page
  _app.tsx          # App wrapper
islands/
  FeatureScreen.tsx  # Interactive components
components/
  DisplayItem.tsx    # Static components
utils/
  firebase.ts        # Firebase config
static/
  styles.css         # Global styles
```

## Common Patterns

### Modal/Dialog
```typescript
// Use Island component with state
const [showModal, setShowModal] = useState(false);
```

### Form Handling
```typescript
// Controlled inputs
<input 
  value={value}
  onInput={(e) => setValue((e.target as HTMLInputElement).value)}
/>
```

### API Calls
```typescript
// In Islands (client-side)
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    setData(data);
  };
  fetchData();
}, []);
```

## Performance Tips

1. **Minimize Islands** - Use static components when possible
2. **Lazy Load Firebase** - Dynamic imports for client-only features
3. **Optimize Images** - Use appropriate formats and sizes
4. **Bundle Splitting** - Fresh handles this automatically

## Deployment

### Environment Variables
```typescript
// For Firebase config
const config = {
  apiKey: Deno.env.get("FIREBASE_API_KEY"),
  // ...
};
```

### Static Files
- Place in `static/` directory
- Served from root path (`/logo.svg`)

## Common Gotchas

1. **No client-side routing** - Use server-side routes
2. **No BuildContext** - Use props and composition
3. **No pubspec.yaml** - Use import maps in `deno.json`
4. **Different lifecycle** - No initState, use useEffect
5. **SSR by default** - Check `window` existence for client-only code