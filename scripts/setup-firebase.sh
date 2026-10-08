#!/usr/bin/env bash
# ==============================================================================
# DoraBot Firebase Google Sign-In Setup Script
# Run this script tomorrow once you enable Firebase in the Google Cloud Console.
# Account: debnatharnab64@gmail.com
# ==============================================================================

echo "🤖 DoraBot Firebase Setup Wizard"
echo "=================================="

# 1. Check logged in user
echo "Checking Firebase CLI authentication..."
firebase login:list

# 2. Check current project
echo ""
echo "Steps to finish Google Login in Firebase Console:"
echo "1. Visit https://console.firebase.google.com and open or add your project ('you-tube-automation-508614' or 'dorabot')"
echo "2. Navigate to Build -> Authentication -> Sign-in method"
echo "3. Click 'Add new provider' -> Select 'Google' -> Click 'Enable'"
echo "4. Set support email to debnatharnab64@gmail.com and save"
echo "5. Navigate to Project Settings -> General -> Your apps -> Click Web icon (</>)"
echo "6. Copy your Firebase SDK config values and paste them into .env or the DoraBot in-app Settings modal"
echo ""
echo "✨ Once saved, restart the app and click 'Google Login' to use your live Google credentials!"
