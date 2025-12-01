import logo from '../../../public/images/logo.png';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src={logo} alt="Apple Land Logo" className="size-5" />
            </div>
            <div className="hidden md:flex lg:space-x-2 ml-1 grid flex-shrink-0 text-left text-xs lg:text-sm">
                <span className="whitespace-nowrap leading-tight font-semibold">
                    Apple Land
                </span>
            </div>
        </>
    );
}
