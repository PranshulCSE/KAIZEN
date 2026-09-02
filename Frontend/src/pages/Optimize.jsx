import { Upload, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';

export default function Optimize() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-50 to-white p-6">
            <div className="container-md">
                <div className="mb-12 text-center animate-fade-in">
                    <h1>Optimize Your Resume</h1>
                    <p className="text-dark-600 mt-2">Paste a job description and we'll show you how to improve</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* UPLOAD */}
                    <Card className="p-8 border-2 border-dashed border-primary-300 hover:border-primary-500 transition-smooth cursor-pointer animate-fade-in">
                        <div className="text-center">
                            <Upload className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                            <h3 className="font-bold mb-2">Upload Resume</h3>
                            <p className="text-dark-600 text-sm mb-4">Drag and drop your resume here or click to browse</p>
                            <Button variant="secondary" size="sm">Choose File</Button>
                            <p className="text-xs text-dark-500 mt-3">PDF or DOCX, max 5MB</p>
                        </div>
                    </Card>

                    {/* JOB DESCRIPTION */}
                    <div className="animate-fade-in-right">
                        <label className="block text-sm font-bold text-dark-900 mb-3">Job Description</label>
                        <textarea
                            placeholder="Paste the full job description here..."
                            className="w-full h-56 p-4 border-2 border-dark-200 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                        />
                        <p className="text-xs text-dark-500 mt-2">The more details, the better the optimization</p>
                    </div>
                </div>

                {/* ANALYZE BUTTON */}
                <div className="mt-8 flex gap-4 justify-center animate-fade-in">
                    <Button variant="primary" size="lg">
                        Analyze & Optimize
                    </Button>
                </div>

                {/* INFO */}
                <Card className="mt-12 p-6 border-l-4 border-accent-500 bg-accent-50 animate-fade-in">
                    <div className="flex gap-4">
                        <AlertCircle className="w-6 h-6 text-accent-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-accent-900 mb-1">AI-Powered Analysis</h3>
                            <p className="text-accent-700 text-sm">Our AI will analyze your resume against the job description and provide line-by-line suggestions to increase your chances of getting hired.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
