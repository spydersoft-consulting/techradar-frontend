#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat
FROM mcr.microsoft.com/dotnet/aspnet:8.0-jammy AS base
WORKDIR /app
COPY . /app

# Create a group and user so we are not running our container and application as root and thus user 0 which is a security issue.
RUN addgroup --system --gid 1000 netcoregroup \
    && adduser --system --uid 1000 --ingroup netcoregroup --shell /bin/sh netcoreuser
  
# Serve on port 8080, we cannot serve on port 80 with a custom user that is not root.
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
  
# Tell docker that all future commands should run as the appuser user, must use the user number
USER 1000

ENTRYPOINT ["dotnet", "Unifi.IpManager.dll"]


