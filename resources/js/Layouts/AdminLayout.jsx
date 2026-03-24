import Sidebar from '@/Components/Admin/Sidebar';
import Header from '@/Components/Admin/Header';

export default function AdminLayout({ auth, children }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            
            <Sidebar /> 
            
            <div className="flex-1 flex flex-col">
                <Header userName={auth?.user?.name} />
                
                <main className="p-8">
                    {children} 
                </main>
            </div>
        </div>
    );
}