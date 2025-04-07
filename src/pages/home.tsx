import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Smartphone, Users, Nfc, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-48 left-1/2 h-96 w-96 -translate-x-1/2 gradient-blur" />
          </div>
          
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl/none lg:text-8xl/none">
                  <span className="text-gradient">Share Your Profile</span>
                  <br />
                  With a Tap
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Create your digital business card and share it instantly using NFC technology.
                  Compatible with both iPhone and Android devices.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-x-4"
              >
                <Button size="lg" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/learn-more">Learn More</Link>
                </Button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 grid grid-cols-3 gap-8 text-center"
              >
                <div>
                  <div className="mx-auto mb-2 text-2xl font-bold">65k+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div>
                  <div className="mx-auto mb-2 text-2xl font-bold">1.5M+</div>
                  <div className="text-sm text-gray-400">Profiles Shared</div>
                </div>
                <div>
                  <div className="mx-auto mb-2 text-2xl font-bold">300k+</div>
                  <div className="text-sm text-gray-400">Business Connected</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="inline-block rounded-lg bg-white/5 p-2">
                  <Nfc className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gradient">NFC Technology</h2>
                <p className="text-gray-400">
                  Our platform leverages NFC technology to make sharing contact information
                  as simple as tapping phones together. Works seamlessly with both iPhone
                  and Android devices.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="inline-block rounded-lg bg-white/5 p-2">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gradient">Secure Sharing</h2>
                <p className="text-gray-400">
                  Your data is protected with enterprise-grade security. Control exactly what
                  information you share and with whom. Update your profile anytime, everywhere.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}