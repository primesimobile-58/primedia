Automation Separation

 - UI calls external automation via NEXT_PUBLIC_AUTOMATION_BASE_URL
 - Keep alya-platform focused on dashboard and analytics
 - Secrets and uploads handled in automation service

Env Vars
 - NEXT_PUBLIC_AUTOMATION_BASE_URL: e.g. https://automation.example.com
 - Supabase keys remain in respective services

