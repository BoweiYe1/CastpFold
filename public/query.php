<html>
<body>
<!--
        Castp server does not needs this php to be functional.
        This is just for the legacy of UCSF chimera CASTp plugin.
-->
<script>
        const search = window.location.search;
        const cutAt = search.indexOf('&');
        var pdbid;
        if(cutAt===-1){
                pdbid = search.slice(search.indexOf('=')+1);
        }
        else{
                pdbid = search.slice(search.indexOf('=')+1, cutAt);
        }
        window.location = '/castp/search?'+pdbid;
</script>

</body>
</html>
