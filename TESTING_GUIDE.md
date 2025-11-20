# Testing Guide for Frontend Fixes

## Quick Start

```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev

# In another terminal, run type checking
npm run type-check

# Run linter
npm run lint

# Build for production (tests SSR)
npm run build
```

## Manual Testing Scenarios

### 1. Test SSR Compatibility ✅

**Objective:** Verify no localStorage errors during server-side rendering

**Steps:**
1. Run `npm run build` in the frontend directory
2. Check build output - should complete without errors
3. Run `npm run start` to start production server
4. Open browser and check console - no localStorage errors

**Expected Result:** 
- Build completes successfully
- No `ReferenceError: localStorage is not defined` errors
- Pages render correctly on first load

### 2. Test Debouncing ✅

**Objective:** Verify API calls are debounced during filter input

**Steps:**
1. Navigate to `http://localhost:3000/listings`
2. Open browser DevTools → Network tab
3. Clear network log
4. Type quickly in the search box: "electronics"
5. Count the number of API calls to `/listings/search`

**Expected Result:**
- Without debouncing: 11+ requests (one per keystroke)
- With debouncing: 1-2 requests (only after 500ms pause)
- Last request happens ~500ms after you stop typing

**Visual Verification:**
- Input field responds immediately (no lag)
- Loading indicator shows after 500ms delay
- Results update smoothly

### 3. Test Caching ✅

**Objective:** Verify data is cached and reused

**Steps:**
1. Navigate to `http://localhost:3000/listings`
2. Open DevTools → Network tab
3. Wait for listings to load (check network activity)
4. Click on any listing to go to detail page
5. Click browser back button to return to listings
6. Check Network tab

**Expected Result:**
- First visit: API call to `/listings/search` visible
- Return visit (within 5 min): No API call, instant load
- After 5 minutes: Cache expires, new API call made

**Console Test:**
```javascript
// In browser console
localStorage.clear(); // Clear any existing data
// Navigate to listings page
// Open console and type:
console.log('Cache should show data after first load');
```

### 4. Test Dynamic Listing Page ✅

**Objective:** Verify listing detail page works correctly

**Steps:**
1. Navigate to `http://localhost:3000/listings`
2. Wait for listings to load
3. Click on any listing card
4. Verify you're redirected to `/listings/[id]` (e.g., `/listings/123`)
5. Check that detail page loads with:
   - Listing images (if available)
   - Title and description
   - Price and location
   - Seller information
   - Navigation buttons

**Expected Result:**
- No 404 error
- Page loads with full listing details
- Images display correctly (or placeholder if none)
- Image carousel works (if multiple images)
- Back to listings link works
- View count increments

**Test Error Handling:**
1. Navigate to non-existent listing: `http://localhost:3000/listings/invalid-id`
2. Should show error message and "Go to Listings" button

## Automated Testing

### Type Checking
```bash
cd frontend
npm run type-check
```
**Expected:** No TypeScript errors

### Linting
```bash
cd frontend
npm run lint
```
**Expected:** No errors, only warnings about `<img>` tags (acceptable for MVP)

### Build Test
```bash
cd frontend
npm run build
```
**Expected:** 
- ✓ Compiled successfully
- All routes generated
- No SSR errors

## Performance Testing

### Debounce Performance
1. Open Network tab
2. Filter: Clear all
3. Type fast: "test search query"
4. Count requests: Should be 1-2 max

### Cache Performance
1. Visit listing page: Note load time (300-500ms)
2. Click on a listing, then back
3. Note load time: Should be < 50ms (instant)

### Image Load Performance
1. Navigate to listing detail page
2. Check Network tab for image requests
3. Verify images load efficiently
4. Test image carousel navigation

## Integration Testing

### Full User Flow
1. **Start:** Home page → Click "Browse Listings"
2. **Filter:** Enter search term, region, price range
3. **Wait:** Observe debouncing (500ms delay)
4. **Browse:** Click on a listing card
5. **View:** Check listing details, images, seller info
6. **Navigate:** Click back, verify cached data
7. **Repeat:** Browse more listings, check cache reuse

### Error Scenarios
1. **No Network:** Disconnect internet, try to load listing
2. **Invalid ID:** Navigate to `/listings/999999`
3. **Empty Results:** Search for non-existent term
4. **No Images:** View listing without images

## Browser Compatibility

Test in multiple browsers:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari (macOS/iOS)
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Regression Testing

After any changes, verify:
1. Search still works with filters
2. Debouncing still active (500ms delay)
3. Cache still works (5-minute TTL)
4. Detail pages still load
5. SSR still works (run `npm run build`)

## Troubleshooting

### Issue: localStorage errors in console
**Solution:** Clear cache and rebuild: `npm run build`

### Issue: No debouncing effect
**Solution:** Check if `useDebouncedValue` hook is imported correctly

### Issue: Cache not working
**Solution:** Check browser console for any errors, verify `getCachedData` is called

### Issue: 404 on listing detail
**Solution:** Verify file exists at `frontend/src/app/listings/[id]/page.tsx`

### Issue: Build fails
**Solution:** 
1. Clear `.next` folder: `rm -rf .next`
2. Reinstall dependencies: `npm install`
3. Run build again: `npm run build`

## Success Criteria

All tests pass when:
- ✅ No SSR errors during build
- ✅ Debouncing reduces API calls by 80%+
- ✅ Cache provides instant loading for repeat visits
- ✅ Detail pages load without 404 errors
- ✅ No TypeScript errors
- ✅ No ESLint errors (warnings acceptable)
- ✅ All user flows work end-to-end

## Reporting Issues

If you find any issues:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Include browser version and OS
4. Take screenshots if relevant
5. Report in issue tracker with "Frontend" label
