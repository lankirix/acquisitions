import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import {slidingWindow} from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
    try {
        const role = req.user?.role || 'guest';

        let limit;
        let message;

        switch(role){
            case 'admin':
                limit = 100;
                message = 'You have reached the maximum number of requests';
                break;
            case 'user':
                limit = 5;
                message = 'You have reached the maximum number of requests';
                break;
            case 'guest':
                limit = 2;
                message = 'You have reached the maximum number of requests';
                break;
            default:
                limit = 1;
                message = 'You have reached the maximum number of requests';
                break;

        }

        // Use the pre-configured Arcjet instance directly
        const decision = await aj.protect(req);

        if (decision.isDenied() && decision.reason.isBot() ) {
            logger.warn('Bot request detected', { ip: req.ip, userAgent: req.get('user-agent'),path: req.path });

            return res.status(403).json({error: 'Forbidden', message: 'We forbid automated requests here' });

        }

        if (decision.isDenied() && decision.reason.isShield() ) {
            logger.warn('Shield thinks this is NO-NO so requesy denied', { ip: req.ip, userAgent: req.get('user-agent'),path: req.path, method: req.method });
    
            return res.status(403).json({error: 'Forbidden', message: 'Request blocked my security policy' });

        }

        if (decision.isDenied() && decision.reason.isRateLimit() ) {
            logger.warn('Bot requestdetected', { ip: req.ip, userAgent: req.get('user-agent'),path: req.path });
    
            return res.status(403).json({error: 'Forbidden', message: 'Too many requests' });
            
        }

        next();
        
    } catch (e) {
        console.error('Arcjet middleware error', e);
        return res.status(403).json({ error: 'Forbidden', message: 'Internal server error' });
    }
}

export default securityMiddleware;