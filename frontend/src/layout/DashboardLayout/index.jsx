"use client";

import { getAllUserProfiles } from "@/config/redux/action/authAction";
import { setTokenIsPresent } from "@/config/redux/reducer/authReducer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Home, Search, Users, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigationItems = [
  {
    id: "dashboard",
    label: "Scroll",
    icon: Home,
    path: "/dashboard",
  },
  {
    id: "discover",
    label: "Discover",
    icon: Search,
    path: "/discover",
  },
  {
    id: "myConnections",
    label: "My Connections",
    icon: Users,
    path: "/myConnections",
  },
];

function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
    dispatch(setTokenIsPresent());
  }, [dispatch, router]);

  useEffect(() => {
    const path = router.pathname;
    if (path.startsWith("/dashboard")) setActiveSection("dashboard");
    else if (path.startsWith("/discover")) setActiveSection("discover");
    else if (path.startsWith("/myConnections"))
      setActiveSection("myConnections");
    else setActiveSection("");
  }, [router.pathname]);

  useEffect(() => {
    if (!authState.allProfilesFetched) {
      dispatch(getAllUserProfiles());
    }
  }, [authState.allProfilesFetched, dispatch]);

  const handleNavigation = (item) => {
    setActiveSection(item.id);
    router.push(item.path);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-12 text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => handleNavigation(item)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );

  const TopProfiles = () => (
    <Card className="h-full border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900">
          Top Profiles
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-3 px-6 pb-6">
            {authState.allProfilesFetched ? (
              authState.allUsers.slice(0, 10).map((person, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={person.userId.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">
                      {person.userId.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {person.userId.name}
                    </p>
                    {person.userId.email && (
                      <p className="text-xs text-gray-500 truncate">
                        {person.userId.email}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {idx + 1}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className=" bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex h-screen lg:h-[calc(89vh-0px)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col bg-white border-r border-gray-200">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <main className="flex-1 px-10">
            <div className="h-full  border-r border-l border-gray-200">
              {children}
            </div>
          </main>

          {/* Right Sidebar - Top Profiles */}
          <div className="hidden xl:block xl:w-80 bg-white border-l border-gray-200">
            <TopProfiles />
          </div>
        </div>
      </div>

      {/* Mobile Top Profiles - Bottom Sheet or Modal */}
      <div className="xl:hidden fixed bottom-4 right-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="rounded-full h-14 w-14 bg-black hover:bg-gray-800">
              <Users className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96">
            <TopProfiles />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default DashboardLayout;
