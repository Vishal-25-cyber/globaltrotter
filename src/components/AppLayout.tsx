import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';

export const AppLayout = () => {
    return (
        <div className="min-h-screen relative">
            {/* Global Background - Crystal Clear 4K */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1534008897995-27a23e859048?q=100&w=2600&auto=format&fit=crop")',
                }}
            />

            <div className="relative z-10">
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
};
