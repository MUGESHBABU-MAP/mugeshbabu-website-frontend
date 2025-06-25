import { useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { marked } from 'marked'

const legalContentMap = {
    privacy: {
        title: 'Privacy Policy',
        content: `
### Introduction

We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.

### What We Collect

- Name, email, phone (only when you share)
- Usage data like page visits, preferences

### How We Use Your Data

- To improve service experience
- To send notifications and updates

### Your Rights

- Request data removal
- Opt-out of marketing
    `,
    },
    terms: {
        title: 'Terms of Service',
        content: `
### Acceptance of Terms

By using our services, you agree to our terms and conditions.

### Use of Service

- Services must not be misused
- Violations may lead to account termination

### Liability

We are not liable for indirect or incidental damages.
    `,
    },
    cookies: {
        title: 'Cookie Policy',
        content: `
### What Are Cookies?

Cookies are small files that enhance user experience.

### How We Use Cookies

- Save preferences
- Analyze traffic
- Improve site speed

You can disable cookies in your browser settings.
    `,
    },
    refund: {
        title: 'Refund Policy',
        content: `
### Refund Eligibility

- Refunds available for cancellations within 2 days of purchase/subscription
- Services must not have been consumed
- Conditions apply

### Process

- Contact support with your receipt
- Refunds processed within 5–7 business days
    `,
    },
}
const LegalPage = () => {
    const { pathname } = useLocation()
    const type = pathname.replace('/', '') // removes leading "/"

    const legal = legalContentMap[type]

    if (!legal) {
        return (
            <div className="py-20 text-center text-gray-600">
                <h1 className="text-2xl font-bold mb-4">404 – Page Not Found</h1>
                <p>This legal document does not exist.</p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold mb-6">{legal.title}</h1>
            <div className="prose prose-sm prose-gray" dangerouslySetInnerHTML={{ __html: marked.parse(legal.content) }} />
        </div>
    )
}

export default LegalPage