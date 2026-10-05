import React from 'react';
import { Link } from 'react-router';
import Logo from '../../assets/Logo.jsx';
import { ROUTES } from '../../constants/routes.js';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-900 border-t border-dark-200/80 dark:border-dark-800 py-12 transition-colors">
      <div className="container-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 sm:col-span-1">
            <Logo />
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-3 leading-relaxed">
              Applicant Tracking System benchmark & AI career toolkit built for modern engineers and professionals.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-dark-900 dark:text-white mb-3">
              Features
            </h4>
            <ul className="space-y-2 text-xs text-dark-600 dark:text-dark-400">
              <li><Link to={ROUTES.BUILDER} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Visual Resume Builder</Link></li>
              <li><Link to={ROUTES.OPTIMIZE} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">ATS Optimizer</Link></li>
              <li><Link to={ROUTES.MOCK_INTERVIEW} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Live Mock Interview</Link></li>
              <li><Link to={ROUTES.COVER_LETTER} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cover Letter Generator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-dark-900 dark:text-white mb-3">
              Tools
            </h4>
            <ul className="space-y-2 text-xs text-dark-600 dark:text-dark-400">
              <li><Link to={ROUTES.JOB_ANALYSES} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Job Keyword Targeter</Link></li>
              <li><Link to={ROUTES.GITHUB_IMPORT} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">GitHub Repo Importer</Link></li>
              <li><Link to={ROUTES.RESUMES} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Document Library</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-dark-900 dark:text-white mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-xs text-dark-600 dark:text-dark-400">
              <li><Link to={ROUTES.LOGIN} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Sign In</Link></li>
              <li><Link to={ROUTES.REGISTER} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Create Account</Link></li>
              <li><Link to={ROUTES.FORGOT_PASSWORD} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Reset Password</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-100 dark:border-dark-800 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-dark-500 dark:text-dark-400 font-mono">
          <p>© {new Date().getFullYear()} Kaizen. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with modern engineering & precision.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
