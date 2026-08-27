export default function AppLogo() {
    return (
        <a href="/" className="flex items-center gap-2">
            <div className="flex h-10 md:h-12 w-auto flex-shrink-0 items-center justify-center rounded-md">
                <img src="/landing/logo/nav-logo.webp" alt="Logo" className="h-full w-auto object-contain" width="48" height="48" />
            </div>

            {/* <div className="text-sidebar-primary-foreground flex-1 text-left text-sm leading-none font-semibold md:text-base">
                <span className="truncate">Grow Up Muslimpreneur</span>
            </div> */}
        </a>
    );
}
