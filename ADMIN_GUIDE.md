# 🎛️ Admin Dashboard Guide

## Overview
The admin dashboard provides comprehensive analytics and monitoring for your Digital Twin chatbot interactions.

## Features

### 📊 Analytics Metrics
- **Total Visitors**: Unique session count
- **Total Questions**: Number of chat interactions
- **Average Response Time**: Performance monitoring
- **Success Rate**: Percentage of successful responses

### 📈 Visualizations
- **Interview Type Distribution**: See which interview scenarios are most common
- **Response Time Distribution**: Track performance (Fast <1s, Medium 1-3s, Slow >3s)
- **Hourly Activity**: Understand when users are most active
- **Top Questions**: Most frequently asked questions

### 📝 Chat Logs
- View all chat interactions with timestamps
- Search logs by keyword
- Filter by session, interview type, or status
- View detailed log information including:
  - User question
  - AI response
  - Response time
  - Context chunks used
  - Session ID
  - Success/error status

### 🔧 Management Functions
- **Export Logs**: Download all logs as JSON
- **Clear Old Logs**: Remove logs older than 30 days
- **Real-time Refresh**: Update metrics on demand
- **Time Range Filters**: View data for last 24 hours, week, month, or all time

## Access

### URL
Navigate to: `http://localhost:3000/admin`

### Authentication
- **Default Password**: `admin123`
- **Change Password**: Set `ADMIN_PASSWORD` in `.env` file

```env
ADMIN_PASSWORD=your_secure_password_here
```

## API Endpoints

### Get Analytics
```
GET /api/admin/analytics?timeRange=day|week|month|all
Authorization: Bearer {password}
```

### Get Logs
```
GET /api/admin/logs?limit=50
Authorization: Bearer {password}
```

### Search Logs
```
GET /api/admin/logs?action=search&keyword=python
Authorization: Bearer {password}
```

### Get Session Logs
```
GET /api/admin/logs?action=session-logs&sessionId={sessionId}
Authorization: Bearer {password}
```

### Export Logs
```
GET /api/admin/analytics?action=export
Authorization: Bearer {password}
```

### Clear Old Logs
```
DELETE /api/admin/analytics?days=30
Authorization: Bearer {password}
```

## Security Considerations

### Production Deployment
1. **Change Default Password**: Immediately change from `admin123`
2. **Use Environment Variables**: Never commit passwords to git
3. **Add Rate Limiting**: Prevent brute force attacks
4. **Implement Proper Auth**: Consider JWT tokens or OAuth
5. **Use HTTPS**: Always use secure connections in production
6. **Database Storage**: Replace in-memory storage with persistent database

### Recommended Setup
```env
# Production .env
ADMIN_PASSWORD=<strong_random_password>
ADMIN_JWT_SECRET=<random_secret_for_jwt>
DATABASE_URL=<your_database_url>
```

## Data Storage

### Current Implementation
- **In-Memory Storage**: Logs stored in memory (lost on restart)
- **Limit**: Last 1000 interactions
- **Suitable For**: Development and testing

### Production Recommendations
- **Database**: PostgreSQL, MongoDB, or similar
- **Log Retention**: 90+ days with archival
- **Backup Strategy**: Regular backups of analytics data
- **Scalability**: Consider dedicated analytics service

## Usage Examples

### Monitoring Performance
1. Access `/admin`
2. Check average response time
3. Review response time distribution
4. Identify slow queries in logs

### Understanding User Behavior
1. View interview type distribution
2. Check hourly activity patterns
3. Review top questions
4. Analyze session patterns

### Debugging Issues
1. Filter logs by error status
2. Search for specific keywords
3. View detailed error messages
4. Check context chunks used

### Data Export
1. Click "Export" button
2. Review JSON data locally
3. Import into analytics tools
4. Generate custom reports

## Future Enhancements

### Planned Features
- [ ] User segmentation and cohort analysis
- [ ] A/B testing for response variations
- [ ] Custom date range selection
- [ ] Email alerts for errors
- [ ] Integration with Google Analytics
- [ ] Custom dashboard widgets
- [ ] API usage metrics
- [ ] Cost tracking (LLM API calls)

### Database Integration
- Migrate to PostgreSQL/MongoDB
- Add data retention policies
- Implement log rotation
- Add full-text search

### Advanced Analytics
- Sentiment analysis of conversations
- Conversion tracking (if integrated with CRM)
- User journey mapping
- Response quality scoring

## Troubleshooting

### Cannot Access Dashboard
- Check URL: `http://localhost:3000/admin`
- Verify server is running
- Check browser console for errors

### Authentication Failed
- Verify password matches `.env` file
- Check `ADMIN_PASSWORD` environment variable
- Restart server after changing password

### No Data Showing
- Send some chat messages first
- Refresh the page
- Check time range filter
- Verify API endpoints are working

### Performance Issues
- Clear old logs (>30 days)
- Reduce number of displayed logs
- Consider database migration for large datasets

## Support
For issues or questions:
- Review code in `/lib/analytics.ts`
- Check API routes in `/app/api/admin/`
- Examine browser console logs
- Review server logs for errors
