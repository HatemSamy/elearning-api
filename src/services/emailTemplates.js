import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Helper function to load and process email templates
const loadTemplate = (templateName, variables = {}) => {
    try {
        const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`)
        let template = fs.readFileSync(templatePath, 'utf8')
        
        // Replace variables in template
        Object.keys(variables).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g')
            template = template.replace(regex, variables[key])
        })
        
        return template
    } catch (error) {
        console.error(`Error loading email template ${templateName}:`, error)
        throw new Error(`Failed to load email template: ${templateName}`)
    }
}

// Password Reset OTP Email Template
export const getPasswordResetOTPTemplate = (username, otp) => {
    return loadTemplate('passwordResetOTP', {
        username,
        otp
    })
}

// Password Reset Success Email Template
export const getPasswordResetSuccessTemplate = (username) => {
    return loadTemplate('passwordResetSuccess', {
        username
    })
}

// Email subjects
export const EMAIL_SUBJECTS = {
    PASSWORD_RESET_OTP: 'Password Reset OTP - E-Learning Platform',
    PASSWORD_RESET_SUCCESS: 'Password Reset Successful - E-Learning Platform'
}