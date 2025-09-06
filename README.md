
## �� API Endpoints

### Backend API (`http://localhost:3000/api`)

- `GET /contacts` - Get all contacts
- `GET /contacts/:id` - Get contact by ID
- `POST /contacts` - Create new contact
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact
- `POST /contacts/random` - Generate random contacts

## 🎨 UI Features

- **Mobile-First Design**: Single-column layout optimized for mobile
- **Responsive Buttons**: Stacked on mobile, side-by-side on larger screens
- **Offline Indicator**: Shows connection status and pending operations
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages

## 🔄 Offline Architecture

### Data Flow
1. **Online**: Direct API calls with local caching
2. **Offline**: Local IndexedDB storage with operation queuing
3. **Sync**: Automatic background sync when online

### Storage
- **IndexedDB**: Local contact storage
- **Pending Operations**: Queue for offline changes
- **Service Worker**: Caching and offline detection

## 🚀 Deployment

### Build for Production

```bash
# Build the Angular app
cd allcloud-contacts
ng build --configuration production

# The built files will be in dist/allcloud-contacts/
```

### Deploy Backend
- Deploy `simple-backend` to any Node.js hosting service
- Update API URL in `contact.service.ts` and `offline.service.ts`

## 🧪 Testing

### Manual Testing
1. **Online Operations**: Test all CRUD operations
2. **Offline Operations**: Test with network disabled
3. **Sync Testing**: Go offline, make changes, go online
4. **Mobile Testing**: Test on various screen sizes

### Browser Support
- Chrome (recommended for PWA features)
- Firefox
- Safari
- Edge

## 📝 Assignment Requirements Met

✅ **Full CRUD Operations**: Create, Read, Update, Delete contacts  
✅ **Mobile-First UI**: Responsive design with mobile optimization  
✅ **Offline Functionality**: Complete offline support with sync  
✅ **Angular SPA**: Single Page Application with routing  
✅ **Custom CSS**: No external UI libraries, custom styling  
✅ **Progressive Web App**: Service worker and PWA capabilities  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of a Salesforce Angular Developer assignment.

## 👨‍💻 Author

**Andrei Goldenberg**  
Email: goldenbergandrei@gmail.com

---

## 🎯 Future Enhancements

- [ ] Search functionality
- [ ] Contact grouping and filtering
- [ ] Image upload for contact photos
- [ ] Export/Import contacts
- [ ] Push notifications
- [ ] Dark mode theme
- [ ] Contact sharing
- [ ] Advanced offline conflict resolution
